import { useLayoutEffect, useRef } from 'react';
import { setupCanvas } from '../../util/setup-canvas';
import { resetCanvas } from '../../util/reset-canvas';

function Overlay({ canvasRef }) {
  const ctxRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    ctxRef.current = ctx;

    const handleResize = () => resetCanvas(canvasRef, ctx);

    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef]);

  return null;
}

export default Overlay;
