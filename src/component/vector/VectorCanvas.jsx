import { useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectVectorShapes } from '../../redux/slice/vectorSlice';

import { setupCanvas } from '../../util/set-canvas';
import { renderVectorScene } from '../../util/vector';

/**
 * @file VectorCanvas.jsx
 * @author YJH
 * @description 벡터 캔버스
 * @returns
 */
function VectorCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const shapes = useSelector(selectVectorShapes);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    renderVectorScene(ctx, shapes);
  }, [shapes]);

  useLayoutEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  return (
    <canvas
      className="vector"
      onContextMenu={(e) => e.preventDefault()}
      ref={canvasRef}
    />
  );
}
export default VectorCanvas;
