// import { useLayoutEffect } from 'react';
// import { useDispatch } from 'react-redux';

// import { setupCanvas } from '../../util/setup-canvas';
// import { bitmapHistory } from '../../util/get-bitmap-history';
// import { pushBitmapSnapshot } from '../../redux/slice/historySlice';

// function Bitmap({ canvasRef }) {
//   const dispatch = useDispatch();
//   useLayoutEffect(() => {
//     const canvas = canvasRef?.current;
//     if (!canvas) return;
//     const ctx = setupCanvas(canvas);
//     const history = bitmapHistory();
//     history.init(canvas, ctx, 10);
//     history.resetToEmpty();
//     dispatch(pushBitmapSnapshot);
//   }, [canvasRef, dispatch]);
//   return null;
// }

// export default Bitmap;

/**
 * @file Bitmap.tsx
 * @description 비트맵 레이어: 도구 스트로크를 즉시 그리며, 종료 시 스냅샷 커밋
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { selectStyleState } from '../../redux/slice/styleSLice';

export default function Bitmap({ canvasRef }) {
  const dispatch = useDispatch();
  const mode = useSelector(selectGlobalMode);
  const style = useSelector(selectStyleState);
  const view = useSelector(selectView);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, teardown } = setupBitmapCanvas(canvas);
    if (!ctx) return () => teardown();
    if (mode !== TOOL.TOOL_TYPE) return () => teardown();

    let drawing = false;
    let last = { x: 0, y: 0 };

    const onDown = (e) => {
      drawing = true;
      const p = clientToCanvas(canvas, e.clientX, e.clientY);
      last = { x: p.x, y: p.y };
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (!drawing) return;
      const p = clientToCanvas(canvas, e.clientX, e.clientY);

      ctx.save();
      applyView(ctx, view);
      ctx.strokeStyle = style.tool.stroke.color;
      ctx.lineWidth = style.tool.stroke.width;
      ctx.setLineDash(style.tool.stroke.dash || []);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.restore();

      last = { x: p.x, y: p.y };
    };

    const onUp = async (e) => {
      if (!drawing) return;
      drawing = false;
      canvas.releasePointerCapture(e.pointerId);

      // 스냅샷 커밋
      const id = await bitmapHistory.put(canvas);
      dispatch({
        type: commitBitmap.type,
        payload: { id },
        meta: { group: `stroke:${Date.now()}` },
      });
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      teardown();
    };
  }, [canvasRef, mode, style, view, dispatch]);

  return null; // 헤드리스
}
