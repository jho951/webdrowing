import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTool } from '../redux/slice/toolSlice';
import { selectActiveShape } from '../redux/slice/shapeSlice';
import { selectActiveColor } from '../redux/slice/colorSlice';
import { selectActiveWidth } from '../redux/slice/widthSlice';

import { getCanvasPos } from '../util/get-canvas-pos.';
import { applyCtxColor, applyCtxWidth } from '../util/get-style';

function useCanvasDraw(canvasRef, ctxRef) {
  const activeTool = useSelector(selectActiveTool);
  const activeShape = useSelector(selectActiveShape);
  const activeColor = useSelector(selectActiveColor);
  const activeWidth = useSelector(selectActiveWidth);

  const drawRef = useRef(activeTool);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const p = getCanvasPos(canvas, e);

    // if (activeShape) {
    //   setIsDragging(true);
    //   shapeRef.current.begin(ctx, { ...p });
    // } else {
    //   drawRef.current.begin(ctx, { ...p });
    //   setIsDrawing(true);
    // }

    if (e.cancelable) e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isDrawing && !isDragging) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const p = getCanvasPos(canvas, e);

    if (activeShape && isDragging) {
      drawRef.current.draw(ctx, { ...p });
    } else {
      applyCtxColor(ctx, activeColor);
      applyCtxWidth(ctx, activeWidth);
      drawRef.current.draw(ctx, { ...p, pressure: e.pressure ?? 0.5 });
    }

    if (e.cancelable) e.preventDefault();
  };

  const endDraw = (e) => {
    if (!isDrawing && !isDragging) return;

    const ctx = ctxRef.current;

    if (isDrawing) {
      drawRef.current.end(ctx);
    } else if (isDragging) {
      drawRef.current.end(ctx);
      setIsDragging(false);
    }

    setIsDrawing(false);

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
