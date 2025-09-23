import { useLayoutEffect, useRef, useState } from 'react';
import { RectTool } from '../../feature/shape/rect';
import { setupCanvas } from '../../util/set-canvas';
import { getCanvasPos } from '../../util/get-canvas-pos.';
import { useSelector } from 'react-redux';
import { selectActiveShape } from '../../redux/slice/shapeSlice';

const Overlay = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const activeShape = useSelector(selectActiveShape);
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePointerDown = (e) => {
    const point = getCanvasPos(canvasRef.current, e);
    RectTool.begin(ctxRef.current, point);
    setIsDrawing(true);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const point = getCanvasPos(canvasRef.current, e);
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    RectTool.draw(ctx, point);
  };

  const handlePointerUp = () => {
    RectTool.end(ctxRef.current);
    setIsDrawing(false);
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="overlay-canvas"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
      }}
    />
  );
};

export default Overlay;
