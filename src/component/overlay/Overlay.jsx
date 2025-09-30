// import { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { setupCanvas } from '../../util/setup-canvas';
// import { resetCanvas } from '../../util/reset-canvas';
// import useBitmap from '../../hook/useBitmap';
// import useShapeOverlay from '../../hook/useShapeOverlay';
// import { addShape } from '../../redux/slice/vectorSlice';
// import {
//   selectMode,
//   selectShape,
//   selectIsShapeMode,
//   selectIsOneShot,
//   finishShapeCommit,
// } from '../../redux/slice/toolSlice';
// import { DEFAULT_EVENT } from '../../constant/event';
// import { markVector } from '../../redux/slice/hubSlice';

// function Overlay({ canvasRef, bitmapRef }) {
//   const dispatch = useDispatch();
//   const mode = useSelector(selectMode);
//   const shape = useSelector(selectShape);
//   const isShapeMode = useSelector(selectIsShapeMode);
//   const oneShot = useSelector(selectIsOneShot);
//   const color = useSelector((s) => s.selection.color);
//   const width = useSelector((s) => s.selection.width);

//   const overlayCtxRef = useRef(null);
//   const bitmapCtxRef = useRef(null);

//   const isShapeModeRef = useRef(isShapeMode);

//   const rasterRef = useRef(DEFAULT_EVENT);
//   const shapeRef = useRef(DEFAULT_EVENT);

//   useEffect(() => {
//     isShapeModeRef.current = isShapeMode;
//   }, [isShapeMode]);

//   useEffect(() => {
//     const oc = canvasRef?.current;
//     if (!oc) return;
//     const setup = () => {
//       const ctx = setupCanvas(oc);
//       overlayCtxRef.current = ctx;
//       resetCanvas(canvasRef, ctx);
//     };
//     setup();
//     const ro = new ResizeObserver(setup);
//     ro.observe(oc);
//     return () => ro.disconnect();
//   }, [canvasRef]);

//   useEffect(() => {
//     const bc = bitmapRef?.current;
//     if (bc && !bitmapCtxRef.current) {
//       bitmapCtxRef.current = bc.getContext('2d', { willReadFrequently: true });
//     }
//   }, [bitmapRef]);

//   const rasterHandlers = useBitmap(canvasRef, bitmapCtxRef, {
//     tool: mode,
//     color,
//     width,
//   });

//   const shapeHandlers = useShapeOverlay(canvasRef, overlayCtxRef, {
//     tool: shape,
//     color,
//     width,
//     onCommit: (s) => {
//       dispatch(
//         addShape({
//           ...s,
//           stroke: s.stroke ?? color,
//           lineWidth: s.lineWidth ?? width,
//         })
//       );
//       dispatch(markVector());

//       if (oneShot) dispatch(finishShapeCommit());
//     },
//   });
//   useEffect(() => {
//     isShapeModeRef.current = isShapeMode;
//   }, [isShapeMode]);

//   useEffect(() => {
//     rasterRef.current = rasterHandlers;
//   }, [rasterHandlers]);
//   useEffect(() => {
//     shapeRef.current = shapeHandlers;
//   }, [shapeHandlers]);

//   useEffect(() => {
//     const el = canvasRef?.current;
//     if (!el) return;
//     const opts = { passive: false };
//     const preventContext = (e) => e.preventDefault();

//     const onPointerDown = (e) =>
//       (isShapeModeRef.current ? shapeRef : rasterRef).current.onPointerDown?.(
//         e
//       );
//     const onPointerMove = (e) =>
//       (isShapeModeRef.current ? shapeRef : rasterRef).current.onPointerMove?.(
//         e
//       );
//     const onPointerUp = (e) =>
//       (isShapeModeRef.current ? shapeRef : rasterRef).current.onPointerUp?.(e);
//     const onPointerLeave = (e) =>
//       (isShapeModeRef.current ? shapeRef : rasterRef).current.onPointerLeave?.(
//         e
//       );
//     const onPointerCancel = (e) =>
//       (isShapeModeRef.current ? shapeRef : rasterRef).current.onPointerCancel?.(
//         e
//       );

//     el.addEventListener('pointerdown', onPointerDown, opts);
//     el.addEventListener('pointermove', onPointerMove, opts);
//     el.addEventListener('pointerup', onPointerUp, opts);
//     el.addEventListener('pointerleave', onPointerLeave, opts);
//     el.addEventListener('pointercancel', onPointerCancel, opts);
//     el.addEventListener('contextmenu', preventContext);

//     return () => {
//       el.removeEventListener('pointerdown', onPointerDown);
//       el.removeEventListener('pointermove', onPointerMove);
//       el.removeEventListener('pointerup', onPointerUp);
//       el.removeEventListener('pointerleave', onPointerLeave);
//       el.removeEventListener('pointercancel', onPointerCancel);
//       el.removeEventListener('contextmenu', preventContext);
//     };
//   }, [canvasRef]);

//   useEffect(() => {
//     const el = canvasRef?.current;
//     if (!el) return;
//     const prev = el.style.cursor;
//     el.style.cursor =
//       isShapeMode || mode === 'brush' || mode === 'eraser'
//         ? 'crosshair'
//         : 'default';
//     return () => {
//       el.style.cursor = prev;
//     };
//   }, [canvasRef, isShapeMode, mode]);

//   return null;
// }

// export default Overlay;

/**
 * @file Overlay.tsx
 * @description 오버레이 레이어: 이벤트 라우팅 + 대시 프리뷰 + 벡터/이미지 배치/텍스트 박스 생성
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setupOverlayCanvas, applyView, clientToCanvas } from '../canvas/setup';
import { selectGlobalMode } from '../redux/slice/modeSlice';
import { selectStyleState } from '../redux/slice/styleSlice';
import { selectView } from '../redux/slice/viewSlice';
import { addShape } from '../redux/slice/shapeSlice';
import { addTextBox, setActiveTextBox } from '../redux/slice/textSlice';
import { placeImage } from '../redux/slice/imageSlice';

export default function Overlay({ canvasRef }) {
  const dispatch = useDispatch();
  const mode = useSelector(selectGlobalMode);
  const style = useSelector(selectStyleState);
  const view = useSelector(selectView);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { ctx, teardown } = setupOverlayCanvas(canvas, 1.5);
    if (!ctx) return () => teardown();

    let dragging = false;
    let start = { x: 0, y: 0 };
    let curr = { x: 0, y: 0 };

    const clear = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const previewRect = () => {
      clear();
      applyView(ctx, view);
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = style.shape?.stroke?.color || '#333';
      ctx.lineWidth = style.shape?.stroke?.width || 1;
      const x = Math.min(start.x, curr.x);
      const y = Math.min(start.y, curr.y);
      const w = Math.abs(curr.x - start.x);
      const h = Math.abs(curr.y - start.y);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    };

    const onDown = (e) => {
      dragging = true;
      const p = clientToCanvas(canvas, e.clientX, e.clientY);
      start = { x: p.x, y: p.y };
      curr = start;
      canvas.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (!dragging) return;
      const p = clientToCanvas(canvas, e.clientX, e.clientY);
      curr = { x: p.x, y: p.y };

      if (
        mode === 'shape' ||
        mode === 'text' ||
        mode === 'image' ||
        mode === 'select'
      ) {
        previewRect();
      }
    };

    const onUp = async (e) => {
      if (!dragging) return;
      dragging = false;
      canvas.releasePointerCapture(e.pointerId);
      clear();

      const x = Math.min(start.x, curr.x);
      const y = Math.min(start.y, curr.y);
      const w = Math.abs(curr.x - start.x);
      const h = Math.abs(curr.y - start.y);

      if (w < 1 && h < 1) return; // 너무 작은 드래그 무시

      if (mode === 'shape') {
        // 현재 payload(사각/원/선 등)는 shapeSlice에서 가져오거나 카탈로그 상태에서 읽어서 주입
        dispatch(
          addShape({
            id: crypto.randomUUID(),
            type: 'rect',
            x,
            y,
            w,
            h,
            stroke: style.shape.stroke,
            fill: style.shape.fill,
            transform: { rotation: 0, scaleX: 1, scaleY: 1 },
          })
        );
      } else if (mode === 'text') {
        const id = crypto.randomUUID();
        dispatch(
          addTextBox({
            id,
            x,
            y,
            w,
            h,
            content: '',
            style: { ...style.text },
          })
        );
        dispatch(setActiveTextBox(id));
        // TODO: 이 시점에 textarea overlay 띄워 입력 받고, blur/Enter에 updateTextBox
      } else if (mode === 'image') {
        // TODO: 파일 선택/드롭과 연결. 여기선 스텁로직
        // 예시: const file = await pickFile(); const url = URL.createObjectURL(file);
        const url = '';
        dispatch(
          placeImage({
            id: crypto.randomUUID(),
            src: url,
            x,
            y,
            w,
            h,
            transform: { rotation: 0, scaleX: 1, scaleY: 1 },
          })
        );
      } else if (mode === 'select') {
        // TODO: 마키 선택 구현(selectSlice.setSelectedIds)
      }
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
