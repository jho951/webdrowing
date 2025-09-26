import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ToolMap } from '../feature/tools';
import { getCanvasPos } from '../util/get-canvas-pos.';

/**
 * @file useBitmap.js
 * @author YJH
 * @description 비트맵 그리기 메서드
 * @param {*} canvasRef 비트맵 캔버스 ref
 * @param {*} ctxRef    픽셀 기반 그리기
 * @returns 
    onPointerDown,
    onPointerMove,
    onPointerUp
    onPointerLeave
    onPointerCancel
 */
function useBitmap(canvasRef, ctxRef) {
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
      drawTool.draw(ctx, { ...p });
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

export { useBitmap };
