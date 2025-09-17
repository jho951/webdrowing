/**
 * @file useCanvasDraw.js
 * @author YJH
 * @description 캔버스 드로잉 커스텀
 * 훅
 */
import { useEffect, useRef } from 'react';
import { initCanvas, getCanvasPos } from '../util/canvas';
import { getTool } from '../tools/index';

/**
 *
 * @param {*} canvasRef
 * @param {*} param1
 * @returns
 */
function useCanvasDraw(
  canvasRef,
  { width = 800, height = 500, tool = 'brush', style = {} } = {}
) {
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const toolRef = useRef(getTool(tool));

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = initCanvas(canvas, { width, height });
  }, [canvasRef, width, height]);

  useEffect(() => {
    toolRef.current = getTool(tool);
  }, [tool]);

  const onPointerDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const p = getCanvasPos(canvas, e);
    canvas.setPointerCapture?.(e.nativeEvent?.pointerId ?? e.pointerId);
    toolRef.current.begin(ctx, p, style);
    drawingRef.current = true;
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const p = getCanvasPos(canvas, e);
    toolRef.current.draw(ctx, p, style);
  };

  const endDraw = (e) => {
    if (!drawingRef.current) return;
    const ctx = ctxRef.current;
    toolRef.current.end(ctx);
    drawingRef.current = false;
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
  };
}

export { useCanvasDraw };
