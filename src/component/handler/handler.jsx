import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useBitmap from '../../hook/useBitmap';

function Handler({ bitmapRef }) {
  const ctxRef = useRef(null);
  const tool = useSelector((s) => s.tool.active);
  const color = useSelector((s) => s.selection?.color);
  const width = useSelector((s) => s.selection?.width);

  useEffect(() => {
    const c = bitmapRef.current;
    if (c && !ctxRef.current) {
      ctxRef.current = c.getContext('2d', { willReadFrequently: true });
    }
  }, [bitmapRef]);

  const {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
  } = useBitmap(bitmapRef, ctxRef, { tool, color, width });

  useEffect(() => {
    const el = bitmapRef.current;
    if (!el) return;

    const opts = { passive: false };
    const preventContext = (e) => e.preventDefault();

    el.addEventListener('pointerdown', onPointerDown, opts);
    el.addEventListener('pointermove', onPointerMove, opts);
    el.addEventListener('pointerup', onPointerUp, opts);
    el.addEventListener('pointerleave', onPointerLeave, opts);
    el.addEventListener('pointercancel', onPointerCancel, opts);
    el.addEventListener('contextmenu', preventContext);

    const prevCursor = el.style.cursor;
    el.style.cursor =
      tool === 'brush' || tool === 'eraser' ? 'crosshair' : prevCursor;

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointercancel', onPointerCancel);
      el.removeEventListener('contextmenu', preventContext);
      el.style.cursor = prevCursor;
    };
  }, [
    bitmapRef,
    tool,
    color,
    width,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
    onPointerCancel,
  ]);

  return null;
}

export default Handler;
