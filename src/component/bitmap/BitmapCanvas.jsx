import { useLayoutEffect, useRef } from 'react';
import { setupCanvas } from '../../util/set-canvas';
import { useBitmap } from '../../hook/useBitmap';

/**
 * @file BitmapCanvas.jsx
 * @author YJH
 * @description 비트맵 기반 캔버스
 */
const BitmapCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const handlers = useBitmap(canvasRef, ctxRef);

  useLayoutEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bitmap"
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
      onPointerCancel={handlers.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default BitmapCanvas;
