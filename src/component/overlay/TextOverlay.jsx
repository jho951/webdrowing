import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupCanvas } from '../../util/set-canvas';
import { getCanvasPos } from '../../util/get-canvas-pos.';
import {
  updateShape,
  selectVectorShapes,
  selectVectorSelectedIds,
  selectShapes as selectVectors,
  toggleShapeSelection,
  removeShapes as removeVectorShapes,
} from '../../redux/slice/vectorSlice';
import {
  addText,
  updateText,
  selectTextItems,
  selectTextSelectedIds,
  selectTexts as selectManyTexts,
  toggleTextSelection,
  removeTexts as removeTextItems,
} from '../../redux/slice/textSlice';
import {
  hitTestVector,
  hitTestText,
  hitTestHandles,
} from '../../util/hit-test';
import { itemBBox, unionBBox, bboxIntersects } from '../../util/hit-group';
import {
  drawRectDashed,
  drawSelectionBoxWithHandles,
  HANDLE_SIZE,
} from '../../util/draw';
import { getId } from '../../util/get-id';
import { clearCanvas } from '../../util/reset-canvas';

// 이 오버레이는 "텍스트 툴" + "선택 툴" 전담.
// - 텍스트 생성/편집
// - 멀티 선택/마키/그룹 이동·리사이즈 (텍스트 + 도형 모두)
export default function TextOverlay() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const dispatch = useDispatch();

  const shapes = useSelector(selectVectorShapes);
  const vSelIds = useSelector(selectVectorSelectedIds);

  const texts = useSelector(selectTextItems);
  const tSelIds = useSelector(selectTextSelectedIds);

  const activeShape = useSelector((st) => st.shape?.active);
  const isTextTool = (activeShape?.value || '').toLowerCase() === 'text';
  const isSelectTool = (activeShape?.value || '').toLowerCase() === 'select';
  const acceptsInput = isTextTool || isSelectTool || !activeShape?.value;

  // 모드
  const [mode, setMode] = useState('idle'); // idle|creating|marquee|moving|resizing
  const [handleIndex, setHandleIndex] = useState(null);

  const startRef = useRef({ x: 0, y: 0 });
  const currRef = useRef({ x: 0, y: 0 });

  // 스냅샷(그룹 변형용)
  const origShapesRef = useRef(null); // Map<id, shape>
  const origTextsRef = useRef(null); // Map<id, text>

  // 텍스트 편집 상태
  const [editing, setEditing] = useState(null); // { rect, draft, style, id? }

  // ==== 공용 유틸 ====
  const clearOverlay = () => clearCanvas(ctxRef.current);

  const getCurrentSelection = () => {
    const targets = [];
    if (tSelIds.length) {
      for (const id of tSelIds) {
        const it = texts.find((t) => t.id === id);
        if (it) targets.push({ layer: 'text', id, item: it });
      }
    }
    if (vSelIds.length) {
      for (const id of vSelIds) {
        const it = shapes.find((s) => s.id === id);
        if (it) targets.push({ layer: 'vector', id, item: it });
      }
    }
    return targets;
  };

  const getGroupBBox = () => {
    const sel = getCurrentSelection();
    if (!sel.length) return null;
    const boxes = sel.map((t) => itemBBox(t.layer, t.item));
    return unionBBox(boxes);
  };

  const redrawSelection = () => {
    clearOverlay();
    const group = getGroupBBox();
    if (group) drawSelectionBoxWithHandles(ctxRef.current, group);
  };

  useEffect(() => {
    redrawSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vSelIds, tSelIds, shapes, texts]);

  const shouldStartMarquee = (hit) => {
    if (isSelectTool) return !hit;
    if (!activeShape?.value) return !hit;
    return false;
  };

  const hitTestAllTopDown = (p) => {
    // 텍스트 → 벡터 순으로 히트
    for (let i = texts.length - 1; i >= 0; i--) {
      if (hitTestText(texts[i], p.x, p.y))
        return { layer: 'text', id: texts[i].id, item: texts[i] };
    }
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (hitTestVector(shapes[i], p.x, p.y))
        return { layer: 'vector', id: shapes[i].id, item: shapes[i] };
    }
    return null;
  };

  // ==== 포인터 핸들러 ====
  const onPointerDown = (e) => {
    if (!acceptsInput) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = getCanvasPos(canvasRef.current, e);
    startRef.current = p;
    currRef.current = p;

    // 텍스트 생성
    if (isTextTool) {
      setMode('creating');
      canvasRef.current.setPointerCapture?.(e.pointerId);
      clearOverlay();
      drawRectDashed(
        ctxRef.current,
        { x: p.x, y: p.y, w: 0, h: 0 },
        'rgba(0,0,0,0.65)'
      );
      return;
    }

    // 선택/마키
    const hit = hitTestAllTopDown(p);

    // 그룹 조작 (핸들/박스)
    const group = getGroupBBox();
    if (group) {
      const hIdx = hitTestHandles(group, p.x, p.y, HANDLE_SIZE);
      if (hIdx !== null) {
        setMode('resizing');
        setHandleIndex(hIdx);
        origShapesRef.current = new Map(
          shapes
            .filter((s) => vSelIds.includes(s.id))
            .map((s) => [s.id, JSON.parse(JSON.stringify(s))])
        );
        origTextsRef.current = new Map(
          texts
            .filter((t) => tSelIds.includes(t.id))
            .map((t) => [t.id, JSON.parse(JSON.stringify(t))])
        );
        return;
      }
      const inside =
        p.x >= group.x &&
        p.x <= group.x + group.w &&
        p.y >= group.y &&
        p.y <= group.y + group.h;
      if (inside) {
        setMode('moving');
        origShapesRef.current = new Map(
          shapes
            .filter((s) => vSelIds.includes(s.id))
            .map((s) => [s.id, JSON.parse(JSON.stringify(s))])
        );
        origTextsRef.current = new Map(
          texts
            .filter((t) => tSelIds.includes(t.id))
            .map((t) => [t.id, JSON.parse(JSON.stringify(t))])
        );
        return;
      }
    }

    // 개별 히트
    if (hit) {
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        if (hit.layer === 'text') dispatch(toggleTextSelection(hit.id));
        else dispatch(toggleShapeSelection(hit.id));
      } else {
        if (hit.layer === 'text') {
          dispatch(selectManyTexts([hit.id]));
          dispatch(selectVectors([]));
        } else {
          dispatch(selectVectors([hit.id]));
          dispatch(selectManyTexts([]));
        }
      }
      return;
    }

    // 빈 곳 → 마키
    if (shouldStartMarquee(hit)) {
      setMode('marquee');
      canvasRef.current.setPointerCapture?.(e.pointerId);
      clearOverlay();
      return;
    }

    // 선택 해제
    dispatch(selectVectors([]));
    dispatch(selectManyTexts([]));
    clearOverlay();
  };

  const onPointerMove = (e) => {
    if (!acceptsInput) return;
    const p = getCanvasPos(canvasRef.current, e);
    currRef.current = p;

    // 텍스트 생성 프리뷰
    if (mode === 'creating') {
      const a = startRef.current,
        b = currRef.current;
      clearOverlay();
      const x = Math.min(a.x, b.x),
        y = Math.min(a.y, b.y);
      const w = Math.abs(b.x - a.x),
        h = Math.abs(b.y - a.y);
      drawRectDashed(ctxRef.current, { x, y, w, h }, 'rgba(0,0,0,0.65)');
      return;
    }

    // 마키 프리뷰
    if (mode === 'marquee') {
      const a = startRef.current,
        b = currRef.current;
      clearOverlay();
      const x = Math.min(a.x, b.x),
        y = Math.min(a.y, b.y);
      const w = Math.abs(b.x - a.x),
        h = Math.abs(b.y - a.y);
      drawRectDashed(ctxRef.current, { x, y, w, h });
      return;
    }

    // 그룹 이동/리사이즈 프리뷰
    if (mode === 'moving' || mode === 'resizing') {
      const group = getGroupBBox();
      if (!group) return;
      let { x, y, w, h } = group;
      const dx = p.x - startRef.current.x;
      const dy = p.y - startRef.current.y;

      if (mode === 'moving') {
        x += dx;
        y += dy;
      } else {
        const hi = handleIndex;
        if (hi === 0) {
          x += dx;
          y += dy;
          w -= dx;
          h -= dy;
        }
        if (hi === 1) {
          y += dy;
          h -= dy;
        }
        if (hi === 2) {
          y += dy;
          h -= dy;
          w += dx;
        }
        if (hi === 3) {
          w += dx;
        }
        if (hi === 4) {
          w += dx;
          h += dy;
        }
        if (hi === 5) {
          h += dy;
        }
        if (hi === 6) {
          x += dx;
          w -= dx;
          h += dy;
        }
        if (hi === 7) {
          x += dx;
          w -= dx;
        }
        w = Math.max(1, w);
        h = Math.max(1, h);
      }
      clearOverlay();
      drawSelectionBoxWithHandles(ctxRef.current, { x, y, w, h });
    }
  };

  const commitCreate = () => {
    setMode('idle');
    const a = startRef.current,
      b = currRef.current;
    const rect = {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: Math.abs(b.x - a.x),
      h: Math.abs(b.y - a.y),
    };
    setEditing({
      rect,
      draft: '',
      style: {
        font: '16px Inter, system-ui',
        lineHeight: 20,
        fill: '#111',
        opacity: 1,
      },
    });
    clearOverlay();
  };

  const commitMarquee = () => {
    setMode('idle');
    const a = startRef.current,
      b = currRef.current;
    const rect = {
      x: Math.min(a.x, b.x),
      y: Math.min(a.y, b.y),
      w: Math.abs(b.x - a.x),
      h: Math.abs(b.y - a.y),
    };
    const hitV = shapes
      .filter((s) => bboxIntersects(itemBBox('vector', s), rect))
      .map((s) => s.id);
    const hitT = texts
      .filter((t) => bboxIntersects(itemBBox('text', t), rect))
      .map((t) => t.id);

    dispatch(selectVectors(hitV));
    dispatch(selectManyTexts(hitT));
    clearOverlay();
  };

  const commitMoveOrResize = () => {
    const p = currRef.current;
    const dx = p.x - startRef.current.x;
    const dy = p.y - startRef.current.y;

    const startGroup = (() => {
      const boxes = [];
      if (origShapesRef.current)
        for (const [, s] of origShapesRef.current)
          boxes.push(itemBBox('vector', s));
      if (origTextsRef.current)
        for (const [, t] of origTextsRef.current)
          boxes.push(itemBBox('text', t));
      return unionBBox(boxes);
    })();

    if (mode === 'moving') {
      if (origShapesRef.current) {
        for (const [id, s0] of origShapesRef.current) {
          if (s0.type === 'rect')
            dispatch(
              updateShape({ id, patch: { x: s0.x + dx, y: s0.y + dy } })
            );
          else if (s0.type === 'ellipse')
            dispatch(
              updateShape({ id, patch: { cx: s0.cx + dx, cy: s0.cy + dy } })
            );
          else if (s0.type === 'line')
            dispatch(
              updateShape({
                id,
                patch: {
                  x1: s0.x1 + dx,
                  y1: s0.y1 + dy,
                  x2: s0.x2 + dx,
                  y2: s0.y2 + dy,
                },
              })
            );
          else if (s0.type === 'polygon') {
            const points = s0.points.map((pt) => ({
              x: pt.x + dx,
              y: pt.y + dy,
            }));
            dispatch(updateShape({ id, patch: { points } }));
          }
        }
      }
      if (origTextsRef.current) {
        for (const [id, t0] of origTextsRef.current) {
          dispatch(updateText({ id, patch: { x: t0.x + dx, y: t0.y + dy } }));
        }
      }
    } else if (mode === 'resizing') {
      const xNew = startGroup.x,
        yNew = startGroup.y;
      let wNew = startGroup.w,
        hNew = startGroup.h;
      const hi = handleIndex;

      if (hi === 0) {
        wNew -= dx;
        hNew -= dy;
      }
      if (hi === 1) {
        hNew -= dy;
      }
      if (hi === 2) {
        wNew += dx;
        hNew -= dy;
      }
      if (hi === 3) {
        wNew += dx;
      }
      if (hi === 4) {
        wNew += dx;
        hNew += dy;
      }
      if (hi === 5) {
        hNew += dy;
      }
      if (hi === 6) {
        wNew -= dx;
        hNew += dy;
      }
      if (hi === 7) {
        wNew -= dx;
      }

      wNew = Math.max(1, wNew);
      hNew = Math.max(1, hNew);

      const sx = wNew / (startGroup.w || 1);
      const sy = hNew / (startGroup.h || 1);

      if (origShapesRef.current) {
        for (const [id, s0] of origShapesRef.current) {
          if (s0.type === 'rect') {
            const nx = xNew + (s0.x - startGroup.x) * sx;
            const ny = yNew + (s0.y - startGroup.y) * sy;
            const nw = s0.w * sx;
            const nh = s0.h * sy;
            dispatch(
              updateShape({ id, patch: { x: nx, y: ny, w: nw, h: nh } })
            );
          } else if (s0.type === 'ellipse') {
            const cx = xNew + (s0.cx - startGroup.x) * sx;
            const cy = yNew + (s0.cy - startGroup.y) * sy;
            const rx = s0.rx * sx;
            const ry = s0.ry * sy;
            dispatch(updateShape({ id, patch: { cx, cy, rx, ry } }));
          } else if (s0.type === 'line') {
            const nx1 = xNew + (s0.x1 - startGroup.x) * sx;
            const ny1 = yNew + (s0.y1 - startGroup.y) * sy;
            const nx2 = xNew + (s0.x2 - startGroup.x) * sx;
            const ny2 = yNew + (s0.y2 - startGroup.y) * sy;
            dispatch(
              updateShape({ id, patch: { x1: nx1, y1: ny1, x2: nx2, y2: ny2 } })
            );
          } else if (s0.type === 'polygon') {
            const points = s0.points.map((pt) => ({
              x: xNew + (pt.x - startGroup.x) * sx,
              y: yNew + (pt.y - startGroup.y) * sy,
            }));
            dispatch(updateShape({ id, patch: { points } }));
          }
        }
      }
      if (origTextsRef.current) {
        for (const [id, t0] of origTextsRef.current) {
          const nx = xNew + (t0.x - startGroup.x) * sx;
          const ny = yNew + (t0.y - startGroup.y) * sy;
          const nw = t0.w * sx;
          const nh = t0.h * sy;
          dispatch(updateText({ id, patch: { x: nx, y: ny, w: nw, h: nh } }));
        }
      }
    }

    setMode('idle');
    setHandleIndex(null);
    origShapesRef.current = null;
    origTextsRef.current = null;
    clearOverlay();
  };

  const onPointerUp = () => {
    if (!acceptsInput) return;
    if (mode === 'creating') return commitCreate();
    if (mode === 'marquee') return commitMarquee();
    if (mode === 'moving' || mode === 'resizing') return commitMoveOrResize();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      if (!vSelIds.length && !tSelIds.length) return;
      if (vSelIds.length) dispatch(removeVectorShapes(vSelIds));
      if (tSelIds.length) dispatch(removeTextItems(tSelIds));
      clearOverlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vSelIds, tSelIds]);

  const textAreaStyle = useMemo(() => {
    if (!editing || !canvasRef.current) return { display: 'none' };
    const r = canvasRef.current.getBoundingClientRect();
    const sx = r.width / canvasRef.current.width;
    const sy = r.height / canvasRef.current.height;
    const css = {
      left: editing.rect.x * sx + r.left + window.scrollX,
      top: editing.rect.y * sy + r.top + window.scrollY,
      width: editing.rect.w * sx,
      height: editing.rect.h * sy,
    };
    return {
      position: 'absolute',
      left: `${css.left}px`,
      top: `${css.top}px`,
      width: `${css.width}px`,
      height: `${css.height}px`,
      padding: '6px 8px',
      outline: '2px solid rgba(0,0,0,0.4)',
      background: 'rgba(255,255,255,0.96)',
      color: '#111',
      font: editing.style?.font || '16px Inter, system-ui',
      lineHeight: `${editing.style?.lineHeight || 20}px`,
      resize: 'none',
      whiteSpace: 'pre-wrap',
      overflow: 'auto',
      zIndex: 10,
      pointerEvents: 'auto',
    };
  }, [editing]);

  const commitText = () => {
    if (!editing) return;
    const { rect, draft, style, id } = editing;
    if (!draft.trim()) {
      setEditing(null);
      return;
    }
    if (id) {
      dispatch(
        updateText({
          id,
          patch: {
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h,
            text: draft,
            font: style.font,
            fill: style.fill,
            lineHeight: style.lineHeight,
            opacity: style.opacity,
          },
        })
      );
      dispatch(selectManyTexts([id]));
      dispatch(selectVectors([]));
    } else {
      const newId = getId();
      dispatch(
        addText({
          id: newId,
          x: rect.x,
          y: rect.y,
          w: rect.w,
          h: rect.h,
          text: draft,
          font: style.font,
          fill: style.fill,
          lineHeight: style.lineHeight,
          align: 'left',
          baseline: 'top',
          opacity: style.opacity,
        })
      );
      dispatch(selectManyTexts([newId]));
      dispatch(selectVectors([]));
    }
    setEditing(null);
  };
  const cancelText = () => setEditing(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
    clearOverlay();
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: acceptsInput ? 'auto' : 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onContextMenu={(e) => e.preventDefault()}
      />
      {editing && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <textarea
            style={textAreaStyle}
            autoFocus
            value={editing.draft}
            onChange={(e) =>
              setEditing((prev) =>
                prev ? { ...prev, draft: e.target.value } : prev
              )
            }
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                commitText();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                cancelText();
              }
            }}
            placeholder="텍스트 입력 (Ctrl/⌘+Enter 확정, Esc 취소)"
          />
          <div
            style={{
              position: 'absolute',
              left: textAreaStyle.left,
              top: `calc(${textAreaStyle.top} + ${textAreaStyle.height})`,
              transform: 'translateY(6px)',
              display: 'flex',
              gap: 8,
              pointerEvents: 'auto',
            }}
          >
            <button onClick={commitText}>확정</button>
            <button onClick={cancelText}>취소</button>
          </div>
        </div>
      )}
    </>
  );
}
