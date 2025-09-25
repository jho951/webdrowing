import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addShape } from '../redux/slice/vectorSlice';
import { selectActiveShape } from '../redux/slice/shapeSlice';
import { selectActiveColor } from '../redux/slice/colorSlice';
import { selectActiveWidth } from '../redux/slice/widthSlice';

import { getId } from '../util/get-id';
import { getCanvasPos } from '../util/get-canvas-pos.';

import { ShapeMap } from '../feature/shape';
import { clearCanvas } from '../util/reset-canvas';

/**
 * @file useShapeOverlay.js
 * @author YJH
 * @description 벡터 오버레이(미리보기) 전용 훅
 *  - begin/draw/end 패턴의 벡터 도구 실행
 *  - 곡선(curve) 2단계 작성 지원(pending)
 *  - 오버레이에서는 점선 프리뷰 적용
 *  - 확정 시 vectorSlice.addShape로 커밋
 */
function useShapeOverlay(canvasRef, ctxRef) {
  const toolStateRef = useRef({});
  const dispatch = useDispatch();
  const activeShape = useSelector(selectActiveShape);
  const activeColor = useSelector(selectActiveColor);
  const activeWidth = useSelector(selectActiveWidth);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const withDashedPreview = (fn) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.setLineDash([6, 6]);
    fn();
    ctx.restore();
  };

  const getTool = () => {
    return ShapeMap[activeShape?.value] || null;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();

    const tool = getTool();
    if (!tool?.begin) return;

    const p = getCanvasPos(canvasRef.current, e);
    tool.begin(
      ctxRef.current,
      p,
      activeWidth.value,
      activeColor.value,
      toolStateRef.current
    );
    setIsPreviewing(true);

    clearCanvas(canvasRef, ctxRef);
    withDashedPreview(() => {
      tool.draw?.(
        ctxRef.current,
        p,
        activeWidth.value,
        activeColor.value,
        toolStateRef.current
      );
    });

    canvasRef.current?.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isPreviewing) return;
    if (e.cancelable) e.preventDefault();

    const tool = getTool();
    if (!tool?.draw) return;

    const p = getCanvasPos(canvasRef.current, e);
    clearCanvas(canvasRef, ctxRef);
    withDashedPreview(() => {
      tool.draw(
        ctxRef.current,
        p,
        activeWidth.value,
        activeColor.value,
        toolStateRef.current
      );
    });
  };

  const endPreview = (e) => {
    if (!isPreviewing) return;
    if (e?.cancelable) e.preventDefault();

    const tool = getTool();
    if (!tool?.end) {
      setIsPreviewing(false);
      clearCanvas(canvasRef, ctxRef);
      return;
    }

    const p = getCanvasPos(canvasRef.current, e);
    const result = tool.end(
      ctxRef.current,
      p,
      activeWidth.value,
      activeColor.value,
      toolStateRef.current
    );

    setIsPreviewing(false);
    clearCanvas(canvasRef, ctxRef);

    if (result?.shape) {
      dispatch(addShape({ id: getId(), ...result.shape }));
    }
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: endPreview,
    onPointerLeave: endPreview,
    onPointerCancel: endPreview,
  };
}

export { useShapeOverlay };
