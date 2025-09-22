/**
 * @file Canvas.jsx
 * @author YJH
 * v1: 고정 크기 캔버스, 도형 클릭 시 중앙에 즉시 렌더
 */
import { useRef } from 'react';
import { useCanvasDraw } from '../../hook/useCanvasDraw';
import { useCanvasInit } from '../../hook/useCanvasInit';

import './canvas.css';
/**
 *
 * @returns
 */
function Canvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useCanvasInit(canvasRef, ctxRef);

  const handlers = useCanvasDraw(canvasRef, ctxRef);

  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     drawImageCentered(canvasRef.current, img);
  //   };
  //   img.src = imageSrc;
  // }, [imageSrc]);
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
      onPointerCancel={handlers.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}

export default Canvas;
