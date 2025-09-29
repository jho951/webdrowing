/**
 * @file HandleLayer.jsx
 * @desc 최상단 상호작용 레이어: 비트맵/도형 오버레이 라우팅 (DashBoard 구조에 맞춤)
 */
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useSelector } from 'react-redux';

import useBitmap from '../../hook/useBitmap';
import { useShapeOverlay } from '../../hook/useShapeOverlay';
import { DRAW } from '../../constant/draw';

const HandleLayer = forwardRef(function HandleLayer(
  { className = '', bitmapRef, vectorRef, overlayRef },
  ref
) {
  const hostRef = useRef(null);
  useImperativeHandle(ref, () => hostRef.current);

  // 활성 툴
  const activeTool = useSelector((s) => s.tool.active);

  // 각 캔버스 2D 컨텍스트 캐싱
  const bitmapCtxRef = useRef(null);
  const overlayCtxRef = useRef(null);
  useEffect(() => {
    const bm = bitmapRef?.current;
    const ov = overlayRef?.current;
    if (bm && !bitmapCtxRef.current) bitmapCtxRef.current = bm.getContext('2d');
    if (ov && !overlayCtxRef.current)
      overlayCtxRef.current = ov.getContext('2d');
  }, [bitmapRef, overlayRef]);

  // 이벤트 핸들러 집합 준비
  const bitmapHandlers = useBitmap(bitmapRef, bitmapCtxRef);
  const shapeHandlers = useShapeOverlay(overlayRef, overlayCtxRef);

  // 현재 툴에 맞게 라우팅
  const handlers = useMemo(
    () => (DRAW.isBitmapTool(activeTool) ? bitmapHandlers : shapeHandlers),
    [activeTool, bitmapHandlers, shapeHandlers]
  );

  // 리사이즈 시 오버레이 잔상 정리
  useEffect(() => {
    const ov = overlayRef?.current;
    if (!ov) return;
    const clear = () => {
      const ctx = overlayCtxRef.current || ov.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ov.width, ov.height);
    };
    const ro = new ResizeObserver(clear);
    ro.observe(ov);
    window.addEventListener('resize', clear);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', clear);
    };
  }, [overlayRef]);

  // (옵션) 나중에 도형 히트테스트/선택을 넣을 자리: vectorRef 활용
  // useEffect(() => {
  //   const v = vectorRef?.current;
  //   if (!v) return;
  //   // 필요 시 v.getContext('2d')로 히트맵 구축/픽셀 검사 등 가능
  // }, [vectorRef]);

  return (
    <section
      ref={hostRef}
      className={`handler ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40, // dashboard.css의 레이어링과 일치
        pointerEvents: 'auto',
      }}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
      onPointerCancel={handlers.onPointerCancel}
    >
      {/* 필요하면 핸들 DOM(리사이즈/회전 앵커) 여기에 렌더 */}
      <div
        className="handler-content"
        style={{ width: '100%', height: '100%' }}
      />
    </section>
  );
});

export default HandleLayer;
