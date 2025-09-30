/**
 * @file useBitmap.js
 * @author YJH
 */
import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { pushBitmapSnapshot } from '../redux/slice/historySlice';

import { ToolMap } from '../feature';
import { DRAW } from '../constant/draw';
import { getCanvasPos } from '../util/get-canvas-pos';

/**
 * @description 비트맵 캔버스 내 그리기 훅
 * @param {*} canvasRef
 * @param {*} ctxRef
 * @param {*} param2
 * @returns
 */
function useBitmap(canvasRef, ctxRef, { tool, color, width }) {
  const dispatch = useDispatch();
  const [isDrawing, setIsDrawing] = useState(false);

  const onPointerDown = useCallback(
    (e) => {
      if (!DRAW.isToolValue(tool)) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      if (e.cancelable) e.preventDefault();

      const p = getCanvasPos(canvas, e);
      const impl = ToolMap[tool];
      if (!impl) return;

      if (tool === 'brush') impl.begin(ctx, p, width, color);
      else impl.begin(ctx, p, width);

      setIsDrawing(true);
      canvas.setPointerCapture?.(e.pointerId);
    },
    [tool, canvasRef, ctxRef, color, width]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isDrawing || !DRAW.isToolValue(tool)) return;

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      if (e.cancelable) e.preventDefault();

      const p = getCanvasPos(canvas, e);
      const impl = ToolMap[tool];
      impl?.draw(ctx, p);
    },
    [isDrawing, tool, canvasRef, ctxRef]
  );

  const endDraw = useCallback(
    (e) => {
      if (!isDrawing) return;
      const ctx = ctxRef.current;
      if (!ctx) return;

      if (e?.cancelable) e.preventDefault();

      const impl = ToolMap[tool];
      impl?.end(ctx);
      setIsDrawing(false);
      dispatch(pushBitmapSnapshot());
    },
    [isDrawing, tool, ctxRef, dispatch]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
    onPointerCancel: endDraw,
  };
}

export default useBitmap;
