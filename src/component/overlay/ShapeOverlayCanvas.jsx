import { useLayoutEffect, useRef } from 'react';
import { setupCanvas } from '../../util/set-canvas';
import { useShapeOverlay } from '../../hook/useShapeOverlay';

/**
 * @file ShapeOverlay.js
 * @author YJH
 * @description 프리뷰/핸들 전용 레이어. 실제 도형 커밋은 useOverlay 훅 내부에서 vectorSlice로.
 */
const ShapeOverlayCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const handlers = useShapeOverlay(canvasRef, ctxRef);

  useLayoutEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="overlay"
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
      onPointerCancel={handlers.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default ShapeOverlayCanvas;
