import { useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { setupCanvas } from '../../util/setup-canvas';

export default function Vector({ canvasRef }) {
  const shapes = useSelector((s) => s.vector?.shapes ?? []);
  const ctxRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    ctxRef.current = setupCanvas(canvas);

    const paint = () => {
      const c = canvasRef?.current,
        cx = ctxRef.current;
      if (!c || !cx) return;
      cx.clearRect(0, 0, c.width, c.height);
      for (const s of shapes) drawShape(cx, s);
    };

    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    window.addEventListener('resize', paint);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', paint);
    };
  }, [canvasRef, shapes]);

  useEffect(() => {
    const c = canvasRef?.current,
      cx = ctxRef.current;
    if (!c || !cx) return;
    cx.clearRect(0, 0, c.width, c.height);
    for (const s of shapes) drawShape(cx, s);
  }, [shapes, canvasRef]);

  return null;
}

function drawShape(ctx, shape) {
  const { type, stroke = '#000', lineWidth = 3 } = shape;
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'line') {
    const { x1, y1, x2, y2 } = shape;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  } else if (type === 'rect') {
    const { x, y, w, h } = shape;
    ctx.strokeRect(x, y, w, h);
  } else if (type === 'circle') {
    const { cx, cy, r } = shape;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (type === 'curve' && shape.kind === 'quadratic') {
    const { x1, y1, x2, y2, cx, cy } = shape;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}
