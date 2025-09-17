/**
 * @file Canvas.jsx
 * @author YJH
 * v1: 고정 크기 캔버스, 도형 클릭 시 중앙에 즉시 렌더
 */
import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveTool } from '../../redux/slice/drawSlice';
import { selectStyle } from '../../redux/slice/styleSlice';

import DefaultState from '../../constant';
import { useCanvasDraw } from '../../hook/useCanvasDraw';

import { getTool } from '../../tools';
import './canvas.css';

const { SIZE } = DefaultState;

function Canvas() {
  const tool = useSelector(selectActiveTool);
  const style = useSelector(selectStyle);

  const canvasRef = useRef(null);
  const dpr = useMemo(
    () => (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1),
    []
  );

  // 백킹 스토어 = CSS × DPR, 좌표계는 setTransform으로 CSS px 기준
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.round(SIZE.width * dpr);
    canvas.height = Math.round(SIZE.height * dpr);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [dpr]);

  // 브러시/지우개 드로잉 핸들러
  const handlers = useCanvasDraw(canvasRef, { tool, style });

  // ★ 도형 즉시 렌더 핸들러(툴바에서 호출)
  useEffect(() => {
    window.__insertShape = (shapeName) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 현재 스타일 적용(도형도 브러시와 동일 스타일로)
      ctx.strokeStyle = style.color ?? '#000000';
      ctx.lineWidth = typeof style.width === 'number' ? style.width : 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const center = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
      const shapeTool = getTool(shapeName);
      shapeTool.begin(ctx, center); // one-shot: begin에서 그려지고 끝
      shapeTool.end?.(ctx);
    };

    return () => {
      delete window.__insertShape;
    };
  }, [style]);

  return (
    <section
      className="canvas-container"
      style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="canvas-wrap"
        style={{ width: '100%', height: '100%', touchAction: 'none' }}
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
        onPointerLeave={handlers.onPointerLeave}
        onPointerCancel={handlers.onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      />
    </section>
  );
}

export default Canvas;
