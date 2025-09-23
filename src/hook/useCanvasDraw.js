/**
 * @file useCanvasDraw.js
 * @author YJH
 */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTool } from '../redux/slice/toolSlice';
import { selectActiveColor } from '../redux/slice/colorSlice';
import { selectActiveWidth } from '../redux/slice/widthSlice';

import { ToolMap } from '../feature/tools';
import { getCanvasPos } from '../util/get-canvas-pos.';

function useCanvasDraw(canvasRef, ctxRef) {
  const activeTool = useSelector(selectActiveTool);
  const activeColor = useSelector(selectActiveColor);
  const activeWidth = useSelector(selectActiveWidth);

  const [isDrawing, setIsDrawing] = useState(false);

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();

    const ctx = ctxRef.current;
    const p = getCanvasPos(canvasRef.current, e);

    const drawTool = ToolMap[activeTool?.value];

    if (drawTool?.begin) {
      drawTool.begin(ctx, p, activeWidth.value, activeColor.value);
      setIsDrawing(true);
    }
  };

  const onPointerMove = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const ctx = ctxRef.current;
    const p = getCanvasPos(canvasRef.current, e);

    const drawTool = ToolMap[activeTool?.value];
    if (drawTool?.draw) {
      drawTool.draw(ctx, { ...p, pressure: e.pressure ?? 0.5 });
    }
  };

  const endDraw = (e) => {
    if (!isDrawing) return;
    if (e?.cancelable) e.preventDefault();

    const ctx = ctxRef.current;
    const drawTool = ToolMap[activeTool?.value];
    if (drawTool?.end) {
      drawTool.end(ctx);
    }

    setIsDrawing(false);
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
