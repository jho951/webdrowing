import { useLayoutEffect, useRef, useState } from 'react';
import { RectTool } from '../../feature/shape/rect';
import { setupCanvas } from '../../util/set-canvas';
import { getCanvasPos } from '../../util/get-canvas-pos.';
import { useSelector } from 'react-redux';
import { selectActiveColor } from '../../redux/slice/colorSlice';
import { selectActiveWidth } from '../../redux/slice/widthSlice';

const Overlay = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef(null);
  const activeColor = useSelector(selectActiveColor);
  const activeWidth = useSelector(selectActiveWidth);

  const handleCommit = ({ x, y, w, h }) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = activeColor.value;
    ctx.lineWidth = activeWidth.value;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();
    const point = getCanvasPos(canvasRef.current, e);
    RectTool.begin(ctxRef.current, point);
    setIsDrawing(true);
    canvasRef.current.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    const point = getCanvasPos(canvasRef.current, e);
    lastPointRef.current = point;

    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    RectTool.draw(ctx, point);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const currentPoint = lastPointRef.current;

    const box = RectTool.end(ctx, currentPoint);
    setIsDrawing(false);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (box && handleCommit) {
      handleCommit({ ...box });
    }
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
