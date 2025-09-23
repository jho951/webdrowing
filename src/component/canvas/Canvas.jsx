/**
 * @file Canvas.jsx
 * @author YJH
 * v1: 고정 크기 캔버스, 도형 클릭 시 중앙에 즉시 렌더
 */
import { useLayoutEffect, useRef } from 'react';
import { setupCanvas } from '../../util/set-canvas';

import { useCanvasDraw } from '../../hook/useCanvasDraw';

import './canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const handlers = useCanvasDraw(canvasRef, ctxRef);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-wrap"
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
      onPointerCancel={handlers.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Canvas;
