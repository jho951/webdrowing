/**
 * @file useCanvasDraw.js
 * @author YJH
 */
import { useEffect, useRef, useState } from 'react';
import { getCanvasPos } from '../util/canvas';
import { getTool } from '../tools';

/**
 *
 * @param {*} canvasRef
 * @param {*} param1
 * @returns
 */
function useCanvasDraw(canvasRef, { tool = 'brush', shape, style } = {}) {
  // 캔버스
  const ctxRef = useRef(null);
  // 툴 객체
  const toolRef = useRef(getTool(tool));
  // 그리기 여부
  const [isDraw, setIsDraw] = useState(false);

  console.log(isDraw);

  const applyStyle = (ctx) => {
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d', { willReadFrequently: true });
    ctxRef.lineCap = 'round';
    ctxRef.lineJoin = 'round';
  }, [canvasRef]);

  useEffect(() => {
    toolRef.current = getTool(tool);
  }, [tool]);

  // 마우스 클릭
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    const p = getCanvasPos(canvas, e);
    toolRef.current.begin(ctx, { ...p });
    setIsDraw(true);

    if (e.cancelable) e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDraw) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const p = getCanvasPos(canvas, e);
    applyStyle(ctx);
    toolRef.current.draw(ctx, { ...p, pressure: e.pressure ?? 0.5 });

    if (e.cancelable) e.preventDefault();
  };

  const endDraw = (e) => {
    if (!isDraw) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    toolRef.current.end(ctx);
    setIsDraw(false);

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
