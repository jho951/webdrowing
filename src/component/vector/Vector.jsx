// /**
//  * @file Vector.js
//  * @author YJH
//  */
// import { useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { resetCanvas } from '../../util/reset-canvas';
// import { renderVectorScene } from '../../util/vector';
// import { setupCanvas } from '../../util/setup-canvas';

// /**
//  * @description 벡터 레이어
//  * @param {*} canvasRef
//  * @returns
//  */
// function Vector({ canvasRef }) {
//   const shapes = useSelector((s) => s.vector.shapes);
//   const ctxRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const setup = () => {
//       const ctx = setupCanvas(canvas);
//       ctxRef.current = ctx;

//       resetCanvas(canvasRef, ctx);
//       renderVectorScene(ctx, shapes);
//     };

//     setup();

//     const ro = new ResizeObserver(() => {
//       setup();
//     });
//     ro.observe(canvas);

//     return () => ro.disconnect();
//   }, [canvasRef]);

//   useEffect(() => {
//     const ctx = ctxRef.current;
//     if (!ctx) return;
//     resetCanvas(canvasRef, ctx);
//     renderVectorScene(ctx, shapes);
//   }, [canvasRef, shapes]);

//   return null;
// }

// export default Vector;

/**
 * @file Vector.tsx
 * @description 벡터 레이어: 도형/텍스트/이미지 렌더
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setupVectorCanvas, applyView } from '../canvas/setup';
import { selectVectorItems } from '../redux/slice/shapeSlice';
import { selectTextBoxes } from '../redux/slice/textSlice';
import { selectImages } from '../redux/slice/imageSlice';
import { selectView } from '../redux/slice/viewSlice';

export default function Vector({ canvasRef }) {
  const shapes = useSelector(selectVectorItems);
  const texts = useSelector(selectTextBoxes);
  const images = useSelector(selectImages);
  const view = useSelector(selectView);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, teardown } = setupVectorCanvas(canvas);
    if (!ctx) return () => teardown();

    // 매 렌더링: 전체 클리어 후 그리기
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    applyView(ctx, view);

    // 도형 (간단 rect 예시 — 필요에 따라 line/ellipse/curve 추가)
    shapes.forEach((s) => {
      ctx.save();

      // 개별 변환
      if (s.transform) {
        const { rotation = 0, scaleX = 1, scaleY = 1 } = s.transform;
        const cx = s.x + s.w / 2;
        const cy = s.y + s.h / 2;
        ctx.translate(cx, cy);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-cx, -cy);
      }

      if (s.fill) {
        const a = s.fill.opacity ?? 1;
        if (s.fill.color && a > 0) {
          ctx.globalAlpha = a;
          ctx.fillStyle = s.fill.color;
          ctx.fillRect(s.x, s.y, s.w, s.h);
          ctx.globalAlpha = 1;
        }
      }
      if (s.stroke) {
        ctx.strokeStyle = s.stroke.color ?? '#111';
        ctx.lineWidth = s.stroke.width ?? 2;
        ctx.setLineDash(s.stroke.dash || []);
        ctx.strokeRect(s.x, s.y, s.w, s.h);
      }
      ctx.restore();
    });

    // 텍스트 (아주 단순 렌더)
    texts.forEach((t) => {
      ctx.save();
      const st = t.style || {};
      ctx.fillStyle = st.color || '#111';
      const fw = st.fontWeight || '400';
      const fs = st.fontSize || 16;
      const ff = st.fontFamily || 'Pretendard';
      ctx.font = `${fw} ${fs}px ${ff}`;
      ctx.textBaseline = 'top';
      ctx.fillText(t.content || '', t.x, t.y, t.w);
      ctx.restore();
    });

    // 이미지 (간단한 drawImage — 실제론 로더/캐시 추천)
    images.forEach((im) => {
      if (im.bitmap) {
        ctx.save();
        // 개별 transform 반영 가능
        ctx.drawImage(im.bitmap, im.x, im.y, im.w, im.h);
        ctx.restore();
      } else if (im.imgEl) {
        ctx.drawImage(im.imgEl, im.x, im.y, im.w, im.h);
      }
    });

    return () => teardown();
  }, [canvasRef, shapes, texts, images, view]);

  return null; // 헤드리스
}
