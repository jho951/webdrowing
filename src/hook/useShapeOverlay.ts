/**
 * @file useShapeOverlay.ts
 * @author YJH
 * @description 벡터 오버레이(미리보기) - drawSlice(active Tool) + selectSlice(color/width) 기반
 */
import { useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';

import { addShape } from '@/redux/slice/vectorSlice';
import { getId } from '@/util/get-id';
import { clearCanvas } from '@/util/canvas/reset-canvas';
import { getCanvasPos, Point } from '@/util/canvas/get-canvas-pos';
import { getOverlayDesign } from '@/util/get-overlay-design';
import { ShapeMap } from '@/feature/shape';
import { Tool } from '@/constant/tool';


const SHAPE_TOOLS: Tool[] = ['circle','rect','line','curve'];

function callShapeMethod(
  key: Tool,
  method: 'begin'|'draw'|'end',
  ctx: CanvasRenderingContext2D,
  p: Point,
  width: number,
  color: string,
  state: Record<string, any>
) {
  const shape = (ShapeMap as any)[key];
  if (!shape?.[method]) return;
  if (key === 'curve') return shape[method](ctx, p, color, width, state);
  return shape[method](ctx, p, width, color, state);
}

type CtxRef = React.RefObject<CanvasRenderingContext2D | null>;
type CanvasRef = React.RefObject<HTMLCanvasElement | null>;

function useShapeOverlay(
  canvasRef: CanvasRef,
  ctxRef:CtxRef
) {
  const dispatch = useDispatch();
  const activeTool = useSelector((s: RootState) => s.tool.active as Tool);

  const rawColor = useSelector((s: RootState) => (s as any).select?.color);
  const rawWidth = useSelector((s: RootState) => (s as any).select?.width);
  const activeColor: string = typeof rawColor === 'object' ? rawColor?.value : rawColor;
  const activeWidth: number = typeof rawWidth === 'object' ? rawWidth?.value : rawWidth;

  const [isPreviewing, setIsPreviewing] = useState(false);
  const toolStateRef = useRef<Record<string, any>>({});
  const lastPointRef = useRef<Point | null>(null);

  const isShapeMode = SHAPE_TOOLS.includes(activeTool);
  const shapeKey = useMemo<Tool | null>(() => (isShapeMode ? activeTool : null), [isShapeMode, activeTool]);

  // React.PointerEvent<HTMLCanvasElement> 를 받도록 타입 지정
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isShapeMode || !shapeKey) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // React 이벤트 → nativeEvent로 좌표 계산
    const p: Point = getCanvasPos(canvas, e.nativeEvent);
    lastPointRef.current = p;

    callShapeMethod(shapeKey, 'begin', ctx, p, activeWidth, activeColor, toolStateRef.current);
    setIsPreviewing(true);

    clearCanvas(canvasRef, ctxRef);
    getOverlayDesign(ctxRef, () => {
      callShapeMethod(shapeKey, 'draw', ctx, p, activeWidth, activeColor, toolStateRef.current);
    });

    canvas.setPointerCapture?.(e.pointerId);
  }, [isShapeMode, shapeKey, canvasRef, ctxRef, activeWidth, activeColor]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPreviewing || !isShapeMode || !shapeKey) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const p: Point = getCanvasPos(canvas, e.nativeEvent);
    lastPointRef.current = p;

    clearCanvas(canvasRef, ctxRef);
    getOverlayDesign(ctxRef, () => {
      callShapeMethod(shapeKey, 'draw', ctx, p, activeWidth, activeColor, toolStateRef.current);
    });
  }, [isPreviewing, isShapeMode, shapeKey, canvasRef, ctxRef, activeWidth, activeColor]);

  const endPreview = useCallback((e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPreviewing) return;
    if (e?.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !shapeKey) {
      setIsPreviewing(false);
      return;
    }

    const p: Point =
      e ? getCanvasPos(canvas, e.nativeEvent) : (lastPointRef.current ?? { x: 0, y: 0 });

    const result = callShapeMethod(shapeKey, 'end', ctx, p, activeWidth, activeColor, toolStateRef.current);

    setIsPreviewing(false);
    clearCanvas(canvasRef, ctxRef);

    if (result?.pending) return; 

    if (result?.shape) {
      dispatch(addShape({ id: getId(), ...result.shape }));
    }
  }, [isPreviewing, shapeKey, canvasRef, ctxRef, activeWidth, activeColor, dispatch]);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endPreview,
    onPointerLeave: endPreview,
    onPointerCancel: endPreview,
  };
}

export {useShapeOverlay}