/**
 * @file Canvas.jsx
 * @author YJH
 * v1: 고정 크기 캔버스, 도형 클릭 시 중앙에 즉시 렌더
 */
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { selectStyle } from '../../redux/slice/styleSlice';
import { selectImageSrc } from '../../redux/slice/imageSlice';
import {
  selectActiveTool,
  selectActiveShape,
} from '../../redux/slice/drawSlice';

import { useCanvasInit } from '../../hook/useCanvasInit';
import { useCanvasDraw } from '../../hook/useCanvasDraw';

import { drawImageCentered } from '../../util/canvas';

import './canvas.css';

function Canvas({ size, dpr }) {
  const canvasRef = useRef(null);

  const tool = useSelector(selectActiveTool);
  const shape = useSelector(selectActiveShape);
  const imageSrc = useSelector(selectImageSrc);
  const style = useSelector(selectStyle);

  useCanvasInit(canvasRef, size, dpr);

  const handlers = useCanvasDraw(canvasRef, { tool, shape, style });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      drawImageCentered(canvasRef.current, img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-wrap"
      onPointerDown={handlers.onPointerDown}
      // 클릭 후 드래그
      onPointerMove={handlers.onPointerMove}
      // 포인터가 더 이상 활성화 되지 않을 때
      onPointerUp={handlers.onPointerUp}
      // 그리기 영역을 벗어날 시
      onPointerLeave={handlers.onPointerLeave}
      // 시스템에 의해 포인터 중지 시 (pc 기반 시 leave로 방어 가능)
      // onPointerCancel={handlers.onPointerCancel}
    />
  );
}

export default Canvas;
