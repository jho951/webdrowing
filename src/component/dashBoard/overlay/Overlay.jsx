/**
 * @file Overlay.jsx
 * @description 오버레이: 비트맵/벡터 프리뷰 + 텍스트 생성/편집(드래그 후만 생성)
 */
import { useRef, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { setupCanvas } from '../../../util/canvas-helper';
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

import { getCanvasPosition } from '../../../util/canvas-helper';

import TextArea from '../../textarea/Textarea';
import {
    getOverlayDesign,
    hitTestTextShapes,
} from '../../../util/overlay-helper';
import { getId } from '../../../util/get-id';

import {
    beginStroke,
    endStroke,
    bitmapHistoryOnResize,
} from '../../../util/get-history';

const DRAG_THRESHOLD = 6;
const MIN_W = 120;
const MIN_H = 40;

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
            observeDevicePixelRatio: true,
            onResize: () => {
                const bctx = bitmapCtxRef?.current;
                if (bctx) bitmapHistoryOnResize(bctx);
            },
        });
        overlayCtxRef.current = ctx;
        teardownRef.current = teardown;
        return () => teardownRef.current?.();
    }, [canvasRef, bitmapCtxRef]);

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

    const [textRect, setTextRect] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editingTarget, setEditingTarget] = useState(null);

    const textDragRef = useRef({
        drawing: false,
        moved: false,
        start: null,
        mode: 'create',
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

            w = Math.max(MIN_W, Math.round(w));
            h = Math.max(MIN_H, Math.round(h));

            clearOverlay();
            setTextRect({ x, y, w, h });
            setShowEditor(true);
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

    const hostEl = canvasRef.current?.parentElement || null;
    const editorPortal =
        showEditor && textRect && hostEl
            ? createPortal(
                  <TextArea
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
                              if (typed.length === 0) {
                                  setShowEditor(false);
                                  setTextRect(null);
                                  setEditingTarget(null);
                                  return;
                              }
                              dispatch(
                                  addShape({
                                      id: getId(),
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

    const isBitmapTool =
        mode === 'tool' && (activeTool === 'brush' || activeTool === 'eraser');

    const bind = useMemo(() => {
        if (isBitmapTool) {
            return {
                onPointerDown: (e) => {
                    const ctx = bitmapCtxRef?.current;
                    if (ctx) beginStroke(ctx);
                    bm.onPointerDown(e);
                },
                onPointerMove: bm.onPointerMove,
                onPointerUp: (e) => {
                    bm.onPointerUp(e);
                    const ctx = bitmapCtxRef?.current;
                    if (ctx) endStroke(ctx);
                },
                onPointerLeave: (e) => {
                    bm.onPointerLeave(e);
                    const ctx = bitmapCtxRef?.current;
                    if (ctx) endStroke(ctx);
                },
                onPointerCancel: (e) => {
                    bm.onPointerCancel(e);
                    const ctx = bitmapCtxRef?.current;
                    if (ctx) endStroke(ctx);
                },
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
        bitmapCtxRef,
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
