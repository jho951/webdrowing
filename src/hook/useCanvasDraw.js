import { useEffect, useRef } from 'react';
import { getCanvasPos } from '../util/canvas';
import { getTool } from '../tools';

function useCanvasDraw(canvasRef, { tool = 'brush', style = {} } = {}) {
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);
  const toolRef = useRef(getTool(tool));
  const pointerIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, [canvasRef]);

  useEffect(() => {
    toolRef.current = getTool(tool);
  }, [tool]);

  const applyStyle = (ctx) => {
    if (!ctx) return;
    ctx.strokeStyle = style.color ?? '#000000';
    ctx.lineWidth = typeof style.width === 'number' ? style.width : 5;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

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
  // Canvas.jsx - 도형 즉시 렌더 핸들러
  useEffect(() => {
    window.__insertShape = (shapeName) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 현재 스타일 적용
      ctx.strokeStyle = style.color ?? '#000000';
      ctx.lineWidth = typeof style.width === 'number' ? style.width : 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const center = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
      const shapeTool = getTool(shapeName); // line/rect/star는 "함수"임

      if (typeof shapeTool === 'function') {
        // ✨ 함수형 도형: (ctx, x, y) 호출
        shapeTool(ctx, center.x, center.y);
      } else if (shapeTool && typeof shapeTool.begin === 'function') {
        // 객체형(브러시/지우개 등): begin/end 호출
        shapeTool.begin(ctx, center);
        shapeTool.end?.(ctx);
      } else {
        console.warn('Unknown shape tool:', shapeName, shapeTool);
      }
    };

    return () => {
      delete window.__insertShape;
    };
  }, [style]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
    onPointerCancel: endDraw,
  };
}

export { useCanvasDraw };
