// hooks/useBitmap.ts
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';


import { ToolMap } from '@/feature/tools';
import { getCanvasPos, type Point } from '@/util/canvas/get-canvas-pos';
import { Tool } from '@/constant/tool';

type CtxRef = React.RefObject<CanvasRenderingContext2D | null>;
type CanvasRef = React.RefObject<HTMLCanvasElement | null>;

// 비트맵 도구만 허용 (브러시/지우개)
// 필요하면 'text'|'image' 추가 가능
const isBitmapTool = (t: Tool): t is 'brush' | 'eraser' =>
  t === 'brush' || t === 'eraser';

export function useBitmap(canvasRef: CanvasRef, ctxRef: CtxRef) {
  const activeTool = useSelector((s: RootState) => s.tool.active as Tool);

  // select 슬라이스가 { value } 또는 원시값일 수 있어 정규화
  const rawColor = useSelector((s: RootState) => (s as any).select?.color);
  const rawWidth = useSelector((s: RootState) => (s as any).select?.width);
  const activeColor: string = typeof rawColor === 'object' ? rawColor?.value : rawColor ?? '#000000';
  const activeWidth: number = typeof rawWidth === 'object' ? rawWidth?.value : rawWidth ?? 3;

  const [isDrawing, setIsDrawing] = useState(false);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (!isBitmapTool(activeTool)) return;

    const p: Point = getCanvasPos(canvas, e.nativeEvent);
    const drawTool = (ToolMap as any)[activeTool];

    if (drawTool?.begin) {
      drawTool.begin(ctx, p, activeWidth, activeColor);
      setIsDrawing(true);
      canvas.setPointerCapture?.(e.pointerId);
    }
  }, [canvasRef, ctxRef, activeTool, activeWidth, activeColor]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (!isBitmapTool(activeTool)) return;

    const p: Point = getCanvasPos(canvas, e.nativeEvent);
    const drawTool = (ToolMap as any)[activeTool];

    if (drawTool?.draw) {
      drawTool.draw(ctx, p);
    }
  }, [canvasRef, ctxRef, isDrawing, activeTool]);

  const endDraw = useCallback((e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e?.cancelable) e.preventDefault();

    const ctx = ctxRef.current;
    if (!ctx) return;

    const drawTool = (ToolMap as any)[activeTool];
    if (drawTool?.end) {
      drawTool.end(ctx);
    }
    setIsDrawing(false);
  }, [ctxRef, isDrawing, activeTool]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDraw,
    onPointerLeave: endDraw,
    onPointerCancel: endDraw,
  };
}

export default useBitmap;
