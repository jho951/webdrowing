/**
 * @file useBitmap.js
 * @author YJH
 */
import { useState, useCallback } from 'react';
import { getCanvasPos } from '../util/get-canvas-pos';
import { ToolMap } from '../feature';

/**
 *
 * @param {*} canvasRef
 * @param {*} ctxRef
 * @param {*} param2
 * @returns
 */
function useBitmap(canvasRef, ctxRef, { tool, color, width }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const isBitmapTool = tool === 'brush' || tool === 'eraser';

  const onPointerDown = useCallback(
    (e) => {
      if (!isBitmapTool) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      const drawTool = ToolMap?.[tool];
      if (drawTool?.begin) {
        drawTool.begin(ctx, p, width, color);
        setIsDrawing(true);
        canvas.setPointerCapture?.(e.pointerId);
      }
    },
    [isBitmapTool, canvasRef, ctxRef, tool, color, width]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isDrawing || !isBitmapTool) return;
      if (e.cancelable) e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      const drawTool = ToolMap?.[tool];
      if (drawTool?.draw) drawTool.draw(ctx, p);
    },
    [isDrawing, isBitmapTool, canvasRef, ctxRef, tool]
  );

  const endDraw = useCallback(
    (e) => {
      if (!isDrawing) return;
      if (e?.cancelable) e.preventDefault();
      const ctx = ctxRef.current;
      if (!ctx) return;
      const drawTool = ToolMap?.[tool];
      if (drawTool?.end) drawTool.end(ctx);
      setIsDrawing(false);
    },
    [isDrawing, ctxRef, tool]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
    onPointerCancel: endDraw,
  };
}

export { useBitmap };
