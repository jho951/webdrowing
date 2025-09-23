import { useLayoutEffect, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setupCanvas } from '../../util/set-canvas';
import { selectVectorShapes } from '../../redux/slice/vectorSlice';
import { SHAPE_TYPES } from '../../util/vector';


export default function Vector() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const shapes = useSelector(selectVectorShapes);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
    draw();
  }, []);

  useEffect(() => { draw(); }, [shapes]);

  const draw = () => {
    const ctx = ctxRef.current; if (!ctx) return;
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    for (const s of shapes) {
      ctx.save();
      ctx.globalAlpha = s.opacity ?? 1;
      ctx.setLineDash(s.lineDash || []);
      ctx.lineWidth = s.lineWidth ?? 2;
      ctx.strokeStyle = s.stroke ?? '#111';

      switch (s.type) {
        case SHAPE_TYPES.RECT:
          if (s.fill) { ctx.fillStyle = s.fill; ctx.fillRect(s.x, s.y, s.w, s.h); }
          ctx.strokeRect(s.x, s.y, s.w, s.h);
          break;

        case SHAPE_TYPES.ELLIPSE:
          ctx.beginPath();
          ctx.ellipse(s.cx, s.cy, s.rx, s.ry, 0, 0, Math.PI * 2);
          if (s.fill) { ctx.fillStyle = s.fill; ctx.fill(); }
          ctx.stroke();
          break;

        case SHAPE_TYPES.LINE:
          ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke();
          break;

        case SHAPE_TYPES.POLYGON:
          if (!s.points?.length) break;
          ctx.beginPath();
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let i=1;i<s.points.length;i++) ctx.lineTo(s.points[i].x, s.points[i].y);
          ctx.closePath();
          if (s.fill) { ctx.fillStyle = s.fill; ctx.fill(); }
          ctx.stroke();
          break;
      }

      ctx.restore();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, display:'block', pointerEvents:'none' }}
    />
  );
}
