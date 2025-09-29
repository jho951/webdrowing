/**
 * @file useShapeOverlay.js
 * @author YJH

 */
import { useRef, useState, useMemo, useCallback } from 'react';

import { ShapeMap } from '../feature';
import { getCanvasPos } from '../util/get-canvas-pos';

/**
 * @description 벡터 오버레이(미리보기) - tool(active) + selection(color/width) 기반
 * @param {*} key
 * @param {*} method
 * @param {*} ctx
 * @param {*} p
 * @param {*} width
 * @param {*} color
 * @param {*} state
 * @returns
 */

const SHAPE_TOOLS = ['circle', 'rect', 'line', 'curve'];

function callShapeMethod(key, method, ctx, p, width, color, state) {
  const shape = ShapeMap?.[key];
  if (!shape?.[method]) return;
  if (key === 'curve') return shape[method](ctx, p, color, width, state);
  return shape[method](ctx, p, width, color, state);
}

function useShapeOverlay(canvasRef, ctxRef, { tool, color, width, onCommit }) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const toolStateRef = useRef({});
  const lastPointRef = useRef(null);

  const isShapeMode = SHAPE_TOOLS.includes(tool);
  const shapeKey = useMemo(
    () => (isShapeMode ? tool : null),
    [isShapeMode, tool]
  );

  const clearOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef, ctxRef]);

  const onPointerDown = useCallback(
    (e) => {
      if (!isShapeMode || !shapeKey) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      lastPointRef.current = p;

      callShapeMethod(
        shapeKey,
        'begin',
        ctx,
        p,
        width,
        color,
        toolStateRef.current
      );
      setIsPreviewing(true);

      clearOverlay();
      callShapeMethod(
        shapeKey,
        'draw',
        ctx,
        p,
        width,
        color,
        toolStateRef.current
      );
      canvas.setPointerCapture?.(e.pointerId);
    },
    [isShapeMode, shapeKey, canvasRef, ctxRef, width, color, clearOverlay]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isPreviewing || !isShapeMode || !shapeKey) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      lastPointRef.current = p;

      clearOverlay();
      callShapeMethod(
        shapeKey,
        'draw',
        ctx,
        p,
        width,
        color,
        toolStateRef.current
      );
    },
    [
      isPreviewing,
      isShapeMode,
      shapeKey,
      canvasRef,
      ctxRef,
      width,
      color,
      clearOverlay,
    ]
  );

  const endPreview = useCallback(
    (e) => {
      if (!isPreviewing) return;
      if (e?.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || !shapeKey) {
        setIsPreviewing(false);
        return;
      }

      const p = e
        ? getCanvasPos(canvas, e.nativeEvent)
        : (lastPointRef.current ?? { x: 0, y: 0 });
      const result = callShapeMethod(
        shapeKey,
        'end',
        ctx,
        p,
        width,
        color,
        toolStateRef.current
      );

      setIsPreviewing(false);
      clearOverlay();

      if (result?.pending) return;
      if (result?.shape && typeof onCommit === 'function')
        onCommit(result.shape);
    },
    [
      isPreviewing,
      shapeKey,
      canvasRef,
      ctxRef,
      width,
      color,
      clearOverlay,
      onCommit,
    ]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endPreview,
    onPointerLeave: endPreview,
    onPointerCancel: endPreview,
  };
}

export { useShapeOverlay };
