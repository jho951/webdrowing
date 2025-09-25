import { useLayoutEffect, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectVectorShapes } from '../../redux/slice/vectorSlice';

import { setupCanvas } from '../../util/set-canvas';
import { renderVectorScene } from '../../util/vector';

import './vector.css';

/**
 *
 * @returns
 */
function VectorCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const shapes = useSelector(selectVectorShapes);

  useLayoutEffect(() => {
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    renderVectorScene(ctx, shapes);
  }, [shapes]);

  return (
    <canvas
      ref={canvasRef}
      className="vector-wrap"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
export default VectorCanvas;
