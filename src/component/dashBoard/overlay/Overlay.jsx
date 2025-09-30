/**
 * @file Overlay.jsx
 * @description 오버레이: 비트맵/벡터 프리뷰 + 텍스트 생성/편집(드래그 후만 생성)
 */
import {
    useRef,
    useLayoutEffect,
    useMemo,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setupCanvas } from '../../../util/setup-canvas';
import { useBitmap } from '../../../hook/useBitmap';
import { useVector } from '../../../hook/useVector';

import { selectGlobalMode } from '../../../redux/slice/modeSlice';
import { selectActiveTool } from '../../../redux/slice/toolSlice';
import {
    addShape,
    updateShape,
    selectVectorItems,
    selectActiveShape,
} from '../../../redux/slice/shapeSlice';
import { selectEffectiveStyle } from '../../../redux/slice/styleSlice';

import { getCanvasPosition } from '../../../util/get-canvas-position';
import { getOverlayDesign } from '../../../util/get-overlay-design';

const uid = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const DRAG_THRESHOLD = 6;
// ✅ 최소 크기 강제 (작게 뜨는 문제 방지)
const MIN_W = 120;
const MIN_H = 40;

function hitTestTextShapes(items, p) {
    if (!Array.isArray(items)) return null;
    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (it?.type !== 'text') continue;
        const { x, y, w, h } = it;
        if (p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h) return it;
    }
    return null;
}

function Overlay({ canvasRef, bitmapCanvasRef, bitmapCtxRef, vectorCtxRef }) {
    const dispatch = useDispatch();

    const teardownRef = useRef(null);
    const overlayCtxRef = useRef(null);

    const mode = useSelector(selectGlobalMode);
    const activeTool = useSelector(selectActiveTool);
    const activeShape = useSelector(selectActiveShape);
    const vecItems = useSelector(selectVectorItems);

    const eff = useSelector(selectEffectiveStyle);
    const strokeColor =
        typeof eff?.stroke?.color === 'object'
            ? eff.stroke.color.value || '#000000'
            : eff?.stroke?.color || '#000000';
    const strokeWidth = Number(eff?.stroke?.width ?? 3);
    const fillOpacity = Number(eff?.fill?.opacity ?? 0);
    const fillEnabled = fillOpacity > 0;
    const fillColor =
        typeof eff?.fill?.color === 'object'
            ? eff.fill.color.value || 'transparent'
            : eff?.fill?.color || 'transparent';

    useLayoutEffect(() => {
        if (!canvasRef?.current) return;
        const { ctx, teardown } = setupCanvas(canvasRef.current, {
            smoothing: true,
            preserve: false,
            maxDpr: 3,
        });
        overlayCtxRef.current = ctx;
        teardownRef.current = teardown;
        return () => teardownRef.current?.();
    }, [canvasRef]);

    const bm = useBitmap(bitmapCanvasRef, bitmapCtxRef, {
        tool: activeTool,
        color: strokeColor,
        width: strokeWidth,
    });

    const vec = useVector(canvasRef, overlayCtxRef, vectorCtxRef, {
        shapeKey: typeof activeShape === 'string' ? activeShape : 'rect',
        strokeColor,
        strokeWidth,
        fillColor,
        fillEnabled,
    });

    const [textRect, setTextRect] = useState(null); // {x,y,w,h}
    const [showEditor, setShowEditor] = useState(false);
    const [editingTarget, setEditingTarget] = useState(null); // 편집 대상

    const textDragRef = useRef({
        drawing: false,
        moved: false,
        start: null,
        mode: 'create', // 'create' | 'edit'
    });

    const clearOverlay = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = overlayCtxRef.current;
        if (!canvas || !ctx) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }, [canvasRef]);

    const drawDashedRect = useCallback(
        (start, now) => {
            const ctx = overlayCtxRef.current;
            const canvas = canvasRef.current;
            if (!ctx || !canvas || !start || !now) return;

            const x = Math.min(start.x, now.x);
            const y = Math.min(start.y, now.y);
            const w = Math.abs(now.x - start.x);
            const h = Math.abs(now.y - start.y);

            clearOverlay();
            getOverlayDesign(overlayCtxRef, () => {
                ctx.strokeRect(x, y, w, h);
            });
        },
        [clearOverlay, canvasRef]
    );

    // ── 텍스트 모드 (드래그해야만) ────────────────────────────────
    const onTextPointerDown = useCallback(
        (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            const host = e.currentTarget;
            if (!host) return;
            if (e.cancelable) e.preventDefault();
            host.setPointerCapture?.(e.pointerId);

            const p = getCanvasPosition(host, e);
            const hit = hitTestTextShapes(vecItems, p);

            if (hit) {
                // 편집: 시작점을 기존 좌상단으로 고정
                setEditingTarget(hit);
                setShowEditor(false);
                setTextRect(null);
                textDragRef.current = {
                    drawing: true,
                    moved: false,
                    start: { x: hit.x, y: hit.y },
                    mode: 'edit',
                };
                return;
            }

            // 생성
            setEditingTarget(null);
            setShowEditor(false);
            setTextRect(null);
            textDragRef.current = {
                drawing: true,
                moved: false,
                start: p,
                mode: 'create',
            };
        },
        [vecItems]
    );

    const onTextPointerMove = useCallback(
        (e) => {
            if (!textDragRef.current.drawing) return;
            const host = e.currentTarget;
            if (!host) return;
            if (e.cancelable) e.preventDefault();

            const p = getCanvasPosition(host, e);
            const s = textDragRef.current.start;
            const dx = Math.abs(p.x - s.x);
            const dy = Math.abs(p.y - s.y);
            const moved = dx >= DRAG_THRESHOLD || dy >= DRAG_THRESHOLD;

            if (moved) {
                textDragRef.current.moved = true;
                drawDashedRect(s, p);
            }
        },
        [drawDashedRect]
    );

    const finishTextDrag = useCallback(
        (p) => {
            const { start } = textDragRef.current;
            textDragRef.current = {
                drawing: false,
                moved: false,
                start: null,
                mode: 'create',
            };

            let x = Math.min(start.x, p.x);
            let y = Math.min(start.y, p.y);
            let w = Math.abs(p.x - start.x);
            let h = Math.abs(p.y - start.y);

            // ✅ 최소 크기 강제
            w = Math.max(MIN_W, Math.round(w));
            h = Math.max(MIN_H, Math.round(h));

            clearOverlay();
            setTextRect({ x, y, w, h });
            setShowEditor(true);
            // 편집 모드면 editingTarget 유지 → initialText로 사용
        },
        [clearOverlay]
    );

    const onTextPointerUp = useCallback(
        (e) => {
            if (!textDragRef.current.drawing) return;
            const host = e.currentTarget;
            if (!host) return;
            if (e?.cancelable) e.preventDefault();

            if (!textDragRef.current.moved) {
                // 클릭으로만 끝나면 아무 것도 열지 않음
                textDragRef.current = {
                    drawing: false,
                    moved: false,
                    start: null,
                    mode: 'create',
                };
                clearOverlay();
                return;
            }

            const p = getCanvasPosition(host, e);
            finishTextDrag(p);
        },
        [finishTextDrag, clearOverlay]
    );

    const onTextPointerLeave = onTextPointerUp;
    const onTextPointerCancel = onTextPointerUp;

    // textarea 포털
    const hostEl = canvasRef.current?.parentElement || null;
    const editorPortal =
        showEditor && textRect && hostEl
            ? createPortal(
                  <TextEditor
                      rect={textRect}
                      initialText={editingTarget?.text || ''}
                      stylePreset={eff?.text}
                      onClose={() => {
                          setShowEditor(false);
                          setTextRect(null);
                          setEditingTarget(null);
                      }}
                      onCommit={(payload) => {
                          const typed = (payload.text ?? '').trim();

                          if (editingTarget?.id) {
                              // ✅ 편집: 입력 비었으면 기존 텍스트 유지, 사이즈/위치만 갱신
                              const nextText =
                                  typed.length === 0
                                      ? editingTarget.text
                                      : payload.text;

                              dispatch(
                                  updateShape({
                                      id: editingTarget.id,
                                      type: 'text',
                                      x: payload.rect.x,
                                      y: payload.rect.y,
                                      w: payload.rect.w,
                                      h: payload.rect.h,
                                      text: nextText,
                                      style: { ...payload.style },
                                  })
                              );
                          } else {
                              // ✅ 생성: 입력 비었으면 생성 취소(아무 것도 추가 안 함)
                              if (typed.length === 0) {
                                  setShowEditor(false);
                                  setTextRect(null);
                                  setEditingTarget(null);
                                  return;
                              }
                              dispatch(
                                  addShape({
                                      id: uid(),
                                      type: 'text',
                                      x: payload.rect.x,
                                      y: payload.rect.y,
                                      w: payload.rect.w,
                                      h: payload.rect.h,
                                      text: payload.text,
                                      style: { ...payload.style },
                                  })
                              );
                          }

                          setShowEditor(false);
                          setTextRect(null);
                          setEditingTarget(null);
                      }}
                  />,
                  hostEl
              )
            : null;

    // 모드별 바인딩
    const isBitmapTool =
        mode === 'tool' && (activeTool === 'brush' || activeTool === 'eraser');

    const bind = useMemo(() => {
        if (isBitmapTool) {
            return {
                onPointerDown: bm.onPointerDown,
                onPointerMove: bm.onPointerMove,
                onPointerUp: bm.onPointerUp,
                onPointerLeave: bm.onPointerLeave,
                onPointerCancel: bm.onPointerCancel,
            };
        }
        if (mode === 'text') {
            return {
                onPointerDown: onTextPointerDown,
                onPointerMove: onTextPointerMove,
                onPointerUp: onTextPointerUp,
                onPointerLeave: onTextPointerLeave,
                onPointerCancel: onTextPointerCancel,
            };
        }
        return {
            onPointerDown: vec.onPointerDown,
            onPointerMove: vec.onPointerMove,
            onPointerUp: vec.onPointerUp,
            onPointerLeave: vec.onPointerLeave,
            onPointerCancel: vec.onPointerCancel,
        };
    }, [
        mode,
        isBitmapTool,
        bm,
        vec,
        onTextPointerDown,
        onTextPointerMove,
        onTextPointerUp,
        onTextPointerLeave,
        onTextPointerCancel,
    ]);

    return (
        <>
            <canvas className="overlay" ref={canvasRef} {...bind} />
            {editorPortal}
        </>
    );
}

export default Overlay;

/** ===== 내부: textarea (바깥 클릭/블러/단축키로 확정) ===== */
function TextEditor({
    rect,
    initialText = '',
    onClose,
    onCommit,
    stylePreset,
}) {
    const taRef = useRef(null);
    const committedRef = useRef(false);

    useEffect(() => {
        if (taRef.current) {
            taRef.current.value = initialText;
            taRef.current.focus();
        }
    }, [initialText]);

    const commit = useCallback(() => {
        if (committedRef.current) return;
        committedRef.current = true;
        const text = taRef.current?.value ?? '';
        onCommit?.({
            text,
            rect: { ...rect },
            style: {
                color: stylePreset?.color,
                fontFamily: stylePreset?.fontFamily,
                fontSize: stylePreset?.fontSize,
                fontWeight: stylePreset?.fontWeight,
                lineHeight: stylePreset?.lineHeight,
                letterSpacing: stylePreset?.letterSpacing,
                align: stylePreset?.align,
                underline: stylePreset?.underline,
                italic: stylePreset?.italic,
            },
        });
    }, [rect, onCommit, stylePreset]);

    const cancel = useCallback(() => {
        committedRef.current = true;
        onClose?.();
    }, [onClose]);

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            commit();
        }
    };

    useEffect(() => {
        const onDocPointerDown = (ev) => {
            const el = taRef.current;
            if (!el) return;
            if (ev.target === el || el.contains(ev.target)) return;
            commit();
        };
        document.addEventListener('pointerdown', onDocPointerDown, true);
        return () =>
            document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [commit]);

    return (
        <textarea
            ref={taRef}
            className="overlay-textarea"
            style={{
                position: 'absolute',
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${Math.max(MIN_W, rect.w)}px`,
                height: `${Math.max(MIN_H, rect.h)}px`,
                margin: 0,
                padding: '6px 8px',
                border: '1px solid rgba(0,0,0,0.2)',
                outline: 'none',
                background: 'rgba(255,255,255,0.95)',
                resize: 'both',
                overflow: 'auto',
                zIndex: 1000,
                color: stylePreset?.color || '#000',
                fontFamily:
                    stylePreset?.fontFamily ||
                    'Pretendard, system-ui, sans-serif',
                fontSize: stylePreset?.fontSize
                    ? `${stylePreset.fontSize}px`
                    : '16px',
                fontWeight: stylePreset?.fontWeight || '400',
                lineHeight: stylePreset?.lineHeight || 1.5,
                letterSpacing: stylePreset?.letterSpacing
                    ? `${stylePreset.letterSpacing}px`
                    : 0,
                textAlign: stylePreset?.align || 'left',
            }}
            placeholder="텍스트 입력… (Esc: 취소, ⌘/Ctrl+Enter: 확정)"
            onKeyDown={onKeyDown}
            onBlur={commit}
        />
    );
}
