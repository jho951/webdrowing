import { useLayoutEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setupCanvas } from '../../util/set-canvas';
import { getCanvasPos } from '../../util/get-canvas-pos.';
import { selectActiveShape } from '../../redux/slice/shapeSlice'; // 팔레트 선택

import { addShape } from '../../redux/slice/vectorSlice';

const DASH = [6, 6];

export default function Overlay() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const currRef = useRef({ x: 0, y: 0 });

  const activeShape = useSelector(selectActiveShape); // {type:'shape', value:'rect'|'circle'|'line'|'star' }
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);

  const clearOverlay = () => {
    const ctx = ctxRef.current;
    if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const renderPreview = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const kind = activeShape?.value || 'rect';
    const a = startRef.current,
      b = currRef.current;

    clearOverlay();

    ctx.save();
    ctx.setLineDash(DASH);
    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
    ctx.lineWidth = 1;

    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);

    switch (kind) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
        break;
      case 'circle': {
        ctx.strokeRect(x, y, w, h); // 보조 박스
        const cx = x + w / 2,
          cy = y + h / 2,
          r = Math.max(w, h) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      }
      case 'star': {
        ctx.strokeRect(x, y, w, h);
        const cx = x + w / 2,
          cy = y + h / 2,
          outerR = Math.max(w, h) / 2,
          innerR = outerR * 0.5;
        const rad = (d) => (d * Math.PI) / 180;
        let ang = -90;
        const step = 36;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const px = cx + r * Math.cos(rad(ang)),
            py = cy + r * Math.sin(rad(ang));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          ang += step;
        }
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'rect':
      default:
        ctx.strokeRect(x, y, w, h);
    }

    ctx.restore();
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const p = getCanvasPos(canvasRef.current, e);
    startRef.current = p;
    currRef.current = p;
    setDragging(true);
    canvasRef.current.setPointerCapture?.(e.pointerId);
    renderPreview();
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    currRef.current = getCanvasPos(canvasRef.current, e);
    renderPreview();
  };

  const handlePointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    // 👉 여기서 벡터 도형 생성 후 Redux에 커밋
    const kind = activeShape?.value || 'rect';

    // 스타일을 별도 slice에서 가져오고 싶다면 여기서 읽어서 넘기세요
    const style = { stroke: '#111', lineWidth: 2 };

    const created = shapeFromDrag(
      kind,
      startRef.current,
      currRef.current,
      style
    );
    if (created) dispatch(addShape(created));

    clearOverlay(); // 프리뷰 제거 (실선은 Vector 레이어가 그림)
  };

  return (
    <canvas
      ref={canvasRef}
      className="overlay-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
        cursor: 'crosshair',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
