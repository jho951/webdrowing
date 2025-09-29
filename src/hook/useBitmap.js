/**
 * @file useBitmap.js
 * @author YJH
 */
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { getCanvasPos } from '../util/canvas/get-canvas-pos';
import { DRAW } from '../constant/draw';
import { ToolMap } from '../feature';

/**
 * @description
 * @param {*} canvasRef
 * @param {*} ctxRef
 * @returns
 */
function useBitmap(canvasRef, ctxRef) {
  const activeTool = useSelector((s) => s.tool.active);
  const rawColor = useSelector((s) => s.selection?.color);
  const rawWidth = useSelector((s) => s.selection?.width);

  const activeColor =
    typeof rawColor === 'object' ? rawColor?.value : (rawColor ?? '#000000');
  const activeWidth =
    typeof rawWidth === 'object' ? rawWidth?.value : (rawWidth ?? 3);

  const [isDrawing, setIsDrawing] = useState(false);

  const onPointerDown = useCallback(
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      if (!DRAW.isBitmapTool(activeTool)) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      const drawTool = ToolMap?.[activeTool];

      if (drawTool?.begin) {
        drawTool.begin(ctx, p, activeWidth, activeColor);
        setIsDrawing(true);
        canvas.setPointerCapture?.(e.pointerId);
      }
    },
    [canvasRef, ctxRef, activeTool, activeWidth, activeColor]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isDrawing) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;
      if (!DRAW.isBitmapTool(activeTool)) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      const drawTool = ToolMap?.[activeTool];

      if (drawTool?.draw) {
        drawTool.draw(ctx, p);
      }
    },
    [canvasRef, ctxRef, isDrawing, activeTool]
  );

  const endDraw = useCallback(
    (e) => {
      if (!isDrawing) return;
      if (e?.cancelable) e.preventDefault();

      const ctx = ctxRef.current;
      if (!ctx) return;

      const drawTool = ToolMap?.[activeTool];
      if (drawTool?.end) {
        drawTool.end(ctx);
      }
      setIsDrawing(false);
    },
    [ctxRef, isDrawing, activeTool]
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
