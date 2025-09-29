/**
 * @file useShapeOverlay.js
 * @author YJH

 */
import { useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ShapeMap } from '../feature';
import { getCanvasPos } from '../util/canvas/get-canvas-pos';
import { resetCanvas } from '../util/canvas/reset-canvas';
import { getOverlayDesign } from '../util/get-overlay-design';
import { addShape } from '../redux/slice/vectorSlice';
import { getId } from '../util/get-id';

const SHAPE_TOOLS = ['circle', 'rect', 'line', 'curve'];

/**
 * @description 벡터 오버레이(미리보기) - tool(active) + selection(color/width) 기반
 * @param {*} key
 * @param {*} method
 * @param {*} ctx
 * @param {*} p
 * @param {*} width
 * @param {*} color
 * @param {*} state
 * @returns
 */
function callShapeMethod(key, method, ctx, p, width, color, state) {
  const shape = ShapeMap?.[key];
  if (!shape?.[method]) return;
  // curve만 (ctx, p, color, width, state)
  if (key === 'curve') return shape[method](ctx, p, color, width, state);
  // 나머지는 (ctx, p, width, color, state)
  return shape[method](ctx, p, width, color, state);
}

export function useShapeOverlay(canvasRef, ctxRef) {
  const dispatch = useDispatch();

  const activeTool = useSelector((s) => s.tool.active);

  // selection 슬라이스에서 색/굵기 읽기 ({value,label}일 수도 있어 정규화)
  const rawColor = useSelector((s) => s.selection?.color);
  const rawWidth = useSelector((s) => s.selection?.width);
  const activeColor = typeof rawColor === 'object' ? rawColor?.value : rawColor;
  const activeWidth = typeof rawWidth === 'object' ? rawWidth?.value : rawWidth;

  const [isPreviewing, setIsPreviewing] = useState(false);
  const toolStateRef = useRef({});
  const lastPointRef = useRef(null);

  const isShapeMode = SHAPE_TOOLS.includes(activeTool);
  const shapeKey = useMemo(
    () => (isShapeMode ? activeTool : null),
    [isShapeMode, activeTool]
  );

  const onPointerDown = useCallback(
    (e) => {
      if (!isShapeMode || !shapeKey) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      lastPointRef.current = p;

      callShapeMethod(
        shapeKey,
        'begin',
        ctx,
        p,
        activeWidth,
        activeColor,
        toolStateRef.current
      );
      setIsPreviewing(true);

      resetCanvas(canvasRef, ctxRef);
      getOverlayDesign(ctxRef, () => {
        callShapeMethod(
          shapeKey,
          'draw',
          ctx,
          p,
          activeWidth,
          activeColor,
          toolStateRef.current
        );
      });

      canvas.setPointerCapture?.(e.pointerId);
    },
    [isShapeMode, shapeKey, canvasRef, ctxRef, activeWidth, activeColor]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!isPreviewing || !isShapeMode || !shapeKey) return;
      if (e.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const p = getCanvasPos(canvas, e.nativeEvent);
      lastPointRef.current = p;

      resetCanvas(canvasRef, ctxRef);
      getOverlayDesign(ctxRef, () => {
        callShapeMethod(
          shapeKey,
          'draw',
          ctx,
          p,
          activeWidth,
          activeColor,
          toolStateRef.current
        );
      });
    },
    [
      isPreviewing,
      isShapeMode,
      shapeKey,
      canvasRef,
      ctxRef,
      activeWidth,
      activeColor,
    ]
  );

  const endPreview = useCallback(
    (e) => {
      if (!isPreviewing) return;
      if (e?.cancelable) e.preventDefault();

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx || !shapeKey) {
        setIsPreviewing(false);
        return;
      }

      const p = e
        ? getCanvasPos(canvas, e.nativeEvent)
        : (lastPointRef.current ?? { x: 0, y: 0 });

      const result = callShapeMethod(
        shapeKey,
        'end',
        ctx,
        p,
        activeWidth,
        activeColor,
        toolStateRef.current
      );

      setIsPreviewing(false);
      resetCanvas(canvasRef, ctxRef);

      if (result?.pending) return;

      if (result?.shape) {
        dispatch(addShape({ id: getId(), ...result.shape }));
      }
    },
    [
      isPreviewing,
      shapeKey,
      canvasRef,
      ctxRef,
      activeWidth,
      activeColor,
      dispatch,
    ]
  );

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endPreview,
    onPointerLeave: endPreview,
    onPointerCancel: endPreview,
  };
}
