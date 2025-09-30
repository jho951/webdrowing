import { useRef, useState, useMemo, useCallback } from 'react';
import { ShapeMap } from '../feature';
import { getCanvasPos } from '../util/get-canvas-pos';
import { getOverlayDesign } from '../util/get-overlay-design';

const SHAPE_TOOLS = ['circle', 'rect', 'line', 'curve'];

function callShapeMethod(key, method, ctx, p, width, color, state) {
  const shape = ShapeMap[key];
  if (!shape?.[method]) return;
  if (key === 'curve') return shape[method](ctx, p, color, width, state);
  return shape[method](ctx, p, width, color, state);
}

function useShapeOverlay(canvasRef, ctxRef, { tool, color, width, onCommit }) {
  const [isPreview, setIsPreview] = useState(false);
  const toolStateRef = useRef({});
  const lastPointRef = useRef(null);
  const isShapeMode = SHAPE_TOOLS.includes(tool);
  const shapeKey = useMemo(
    () => (isShapeMode ? tool : null),
    [isShapeMode, tool]
  );

  const clearOverlay = useCallback(() => {
    const canvas = canvasRef.current,
      ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef, ctxRef]);

  const onPointerDown = useCallback(
    (e) => {
      if (!isShapeMode || !shapeKey) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current,
        ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e);
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
      setIsPreview(true);

      clearOverlay();
      getOverlayDesign(ctxRef, () => {
        callShapeMethod(
          shapeKey,
          'draw',
          ctx,
          p,
          width,
          color,
          toolStateRef.current
        );
      });

      canvas.setPointerCapture?.(e.pointerId);
    },
    [isShapeMode, shapeKey, canvasRef, ctxRef, width, color, clearOverlay]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isPreview || !isShapeMode || !shapeKey) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current,
        ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e);
      lastPointRef.current = p;

      clearOverlay();
      getOverlayDesign(ctxRef, () => {
        callShapeMethod(
          shapeKey,
          'draw',
          ctx,
          p,
          width,
          color,
          toolStateRef.current
        );
      });
    },
    [
      isPreview,
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
      if (!isPreview) return;
      if (e?.cancelable) e.preventDefault();

      const canvas = canvasRef.current,
        ctx = ctxRef.current;
      if (!canvas || !ctx || !shapeKey) {
        setIsPreview(false);
        return;
      }

      const p = e
        ? getCanvasPos(canvas, e)
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

      setIsPreview(false);
      clearOverlay();

      if (result?.pending) return;
      if (result?.shape && typeof onCommit === 'function')
        onCommit(result.shape);
    },
    [
      isPreview,
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

export default useShapeOverlay;
