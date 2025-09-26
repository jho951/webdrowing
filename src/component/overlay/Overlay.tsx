import React, {
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import { useBitmap } from '@/hook/useBitmap';
import { useShapeOverlay } from '@/hook/useShapeOverlay';
import { setupCanvas } from '@/util/set-canvas';

type OverlayCanvasProps = {
  className?: string;
  bitmapRef: React.RefObject<HTMLCanvasElement>;
  vectorRef: React.RefObject<HTMLCanvasElement>;
  overlayRef: React.RefObject<HTMLCanvasElement>;
  handlerRef?: React.RefObject<HTMLDivElement>;
};

const Overlay = forwardRef<HTMLCanvasElement, OverlayCanvasProps>(
  ({ className, bitmapRef, vectorRef, overlayRef, handlerRef }, ref) => {
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    useImperativeHandle(ref, () => overlayRef.current as HTMLCanvasElement);

    const shapeHandlers = useShapeOverlay(vectorRef, ctxRef);
    const brushHandlers = useBitmap(bitmapRef, ctxRef);

    const activeHandlers = (() => {
      const tool = 'brush';
      if (tool === 'brush' || tool === 'eraser') return brushHandlers;
      if (tool === 'rect' || tool === 'circle' || tool === 'line')
        return shapeHandlers;
      return {};
    })();

    useLayoutEffect(() => {
      if (!overlayRef.current) return;
      const ctx = setupCanvas(overlayRef.current);
      ctxRef.current = ctx;
    }, []);

    return (
      <canvas
        ref={overlayRef}
        className={className}
        onPointerDown={activeHandlers.onPointerDown}
        onPointerMove={activeHandlers.onPointerMove}
        onPointerUp={activeHandlers.onPointerUp}
        onPointerLeave={activeHandlers.onPointerLeave}
        onPointerCancel={activeHandlers.onPointerCancel}
      />
    );
  }
);

Overlay.displayName = 'Overlay';
export default Overlay;
