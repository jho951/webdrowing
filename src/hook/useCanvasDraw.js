import { useEffect, useRef } from 'react';
import { getCanvasPos } from '../util/canvas';
import { getTool } from '../tools';

function useCanvasDraw(canvasRef, { tool = 'brush', style = {} } = {}) {
  // 캔버스
  const ctxRef = useRef(null);
  // 그리기 여부
  const drawingRef = useRef(false);
  // 툴 객체
  const toolRef = useRef(getTool(tool));
  const pointerIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, [canvasRef]);

  useEffect(() => {
    toolRef.current = getTool(tool);
    console.log(tool);
  }, [tool]);

  const applyStyle = (ctx) => {
    ctx.strokeStyle = style.color ?? '#000000';
    ctx.lineWidth = typeof style.width === 'number' ? style.width : 5;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const p = getCanvasPos(canvas, e);
    const pid = e.nativeEvent?.pointerId ?? e.pointerId;
    pointerIdRef.current = pid;
    canvas.setPointerCapture?.(pid);

    applyStyle(ctx);
    toolRef.current.begin(ctx, { ...p, pressure: e.pressure ?? 0.5 });
    drawingRef.current = true;

    if (e.cancelable) e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const p = getCanvasPos(canvas, e);
    applyStyle(ctx);
    toolRef.current.draw(ctx, { ...p, pressure: e.pressure ?? 0.5 });

    if (e.cancelable) e.preventDefault();
  };

  const endDraw = (e) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    toolRef.current.end(ctx);
    drawingRef.current = false;

    const pid =
      pointerIdRef.current ?? e?.nativeEvent?.pointerId ?? e?.pointerId;
    canvas.releasePointerCapture?.(pid);
    pointerIdRef.current = null;

    if (e?.cancelable) e.preventDefault();
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
    onPointerCancel: endDraw,
  };
}

export { useCanvasDraw };
