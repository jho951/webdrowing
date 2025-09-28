import React, {
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';

import { useBitmap } from '@/hook/useBitmap';
import { useShapeOverlay } from '@/hook/useShapeOverlay';

import type { Tool } from '@/constant/tool';
import { setupCanvas } from '@/util/canvas/setup-canvas';


type OverlayCanvasProps = {
  className?: string;
  /** 실제 픽셀을 그리는 하단 비트맵 캔버스 */
  bitmapRef: React.RefObject<HTMLCanvasElement|null>;
  /** 벡터 결과 리드로잉 레이어(현재 이 컴포넌트에선 직접 참조하지 않음) */
  vectorRef: React.RefObject<HTMLCanvasElement|null>;
  /** 포인터 이벤트/프리뷰 담당 오버레이(이 컴포넌트가 렌더하는 canvas) */
  overlayRef: React.RefObject<HTMLCanvasElement|null>;
  /** 핸들 레이어(현재 미사용) */
  handlerRef?: React.RefObject<HTMLDivElement|null>;
};

type OverlayHandlers = {
  onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerLeave?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerCancel?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
};

const isBitmapTool = (t: Tool): t is 'brush' | 'eraser' =>
  t === 'brush' || t === 'eraser';

const isShapeTool = (t: Tool): t is 'circle' | 'rect' | 'line' | 'curve' =>
  t === 'circle' || t === 'rect' || t === 'line' || t === 'curve';

const Overlay = forwardRef<HTMLCanvasElement, OverlayCanvasProps>(
  ({ className, bitmapRef, vectorRef: _vectorRef, overlayRef }, ref) => {
    // 프리뷰(오버레이) ctx
    const overlayCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    // 실제 픽셀(비트맵) ctx
    const bitmapCtxRef = useRef<CanvasRenderingContext2D | null>(null);

    // 외부에서 overlay DOM 접근 가능
    useImperativeHandle(ref, () => overlayRef.current as HTMLCanvasElement);

    // 활성 툴
    const activeTool = useSelector((s: RootState) => s.tool.active as Tool);

    // 이벤트는 항상 overlayRef(표면)에서 받고,
    // 브러시/지우개 → bitmapCtxRef, 도형 프리뷰 → overlayCtxRef 에 그린다.
    const brushHandlers = useBitmap(overlayRef, bitmapCtxRef);
    const shapeHandlers = useShapeOverlay(overlayRef, overlayCtxRef);

    const activeHandlers: OverlayHandlers = useMemo(() => {
      if (isBitmapTool(activeTool)) return brushHandlers;
      if (isShapeTool(activeTool)) return shapeHandlers;
      return {};
    }, [activeTool, brushHandlers, shapeHandlers]);

    useLayoutEffect(() => {
      // 오버레이 캔버스 초기화 (DPR 스케일 + 컨텍스트 획득)
      if (overlayRef.current) {
        overlayCtxRef.current = setupCanvas(overlayRef.current);
      }
      // 비트맵 컨텍스트 획득 (Bitmap 헤드리스에서 이미 셋업되어 있어도 동일 핸들 반환)
      if (bitmapRef.current) {
        bitmapCtxRef.current = bitmapRef.current.getContext('2d', {
          willReadFrequently: true,
        });
      }
    }, [overlayRef, bitmapRef]);

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
