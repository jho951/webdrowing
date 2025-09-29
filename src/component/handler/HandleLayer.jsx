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
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useBitmap } from '../../hook/useBitmap';
import { useShapeOverlay } from '../../hook/useShapeOverlay';
import { DRAW } from '../../constant/draw';
import { addShape } from '../../redux/slice/vectorSlice';
import { getId } from '../../util/get-id';

const NOOP = () => {};
const NOOP_HANDLERS = {
  onPointerDown: NOOP,
  onPointerMove: NOOP,
  onPointerUp: NOOP,
  onPointerLeave: NOOP,
  onPointerCancel: NOOP,
};

const HandleLayer = forwardRef(function HandleLayer(
  { className = '', bitmapRef, overlayRef },
  ref
) {
  const hostRef = useRef(null);
  useImperativeHandle(ref, () => hostRef.current);

  const dispatch = useDispatch();
  const tool = useSelector((s) => s.tool.active);
  const colorRaw = useSelector((s) => s.selection?.color);
  const widthRaw = useSelector((s) => s.selection?.width);

  const color =
    typeof colorRaw === 'object' ? colorRaw?.value : (colorRaw ?? '#000000');
  const width =
    typeof widthRaw === 'object' ? widthRaw?.value : (widthRaw ?? 3);

  const bitmapCtxRef = useRef(null);
  const overlayCtxRef = useRef(null);

  useEffect(() => {
    const bm = bitmapRef?.current;
    const ov = overlayRef?.current;
    bitmapCtxRef.current = bm ? bm.getContext('2d') : null;
    overlayCtxRef.current = ov ? ov.getContext('2d') : null;
  }, [bitmapRef, overlayRef]);

  useEffect(() => {
    const ov = overlayRef?.current;
    if (!ov) return;
    const handleResize = () => {
      overlayCtxRef.current = ov.getContext('2d');
      const ctx = overlayCtxRef.current;
      if (ctx) ctx.clearRect(0, 0, ov.width, ov.height);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(ov);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [overlayRef]);

  const onCommitShape = useCallback(
    (shape) => {
      dispatch(addShape({ id: getId(), ...shape }));
    },
    [dispatch]
  );

  const bitmapHandlers = useBitmap(bitmapRef, bitmapCtxRef, {
    tool,
    color,
    width,
  });
  const shapeHandlers = useShapeOverlay(overlayRef, overlayCtxRef, {
    tool,
    color,
    width,
    onCommit: onCommitShape,
  });

  const handlers = useMemo(
    () =>
      DRAW.isBitmapTool(tool)
        ? bitmapHandlers || NOOP_HANDLERS
        : shapeHandlers || NOOP_HANDLERS,
    [tool, bitmapHandlers, shapeHandlers]
  );

  return (
    <section
      ref={hostRef}
      className={`handler ${className}`}
      role="application"
      tabIndex={0}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        pointerEvents: 'auto',
        touchAction: 'none',
      }}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
      onPointerCancel={handlers.onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="handler-content"
        style={{ width: '100%', height: '100%' }}
      />
    </section>
  );
});

export default HandleLayer;
