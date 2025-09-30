/**
 * @file useVector.js
 * @description 오버레이에서 드래그 프리뷰(점선) → 벡터 캔버스에 확정 렌더(테두리만 기본)
 *
 * previewCanvasRef / previewCtxRef : 오버레이 (프리뷰)
 * vectorCtxRef : 벡터 레이어 (확정)
 *
 * shapeKey: 'line' | 'rect' | 'circle' | 'curve'
 * fillEnabled=false 이면 확정 시에도 채우지 않음(외곽선만)
 */
/**
 * @file useVector.js
 * @description 오버레이 프리뷰(점선) → 확정 시 Redux에 저장(addShape), Vector가 재그리기
 */

import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getCanvasPosition } from '../util/get-canvas-position';
import { SHAPE_FEATURE } from '../feature/shape';
import { getOverlayDesign } from '../util/get-overlay-design';
import { addShape } from '../redux/slice/shapeSlice';

// 간단한 ID 유틸
const uid = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function useVector(
    previewCanvasRef, // overlay canvas
    previewCtxRef, // overlay ctx
    _vectorCtxRef, // (직접 그리지 않음) Vector 컴포넌트가 상태로 재그림
    {
        shapeKey = 'rect',
        strokeColor = '#000',
        strokeWidth = 2,
        fillColor = 'transparent',
        fillEnabled = false, // 기본은 채우기 꺼짐
    } = {}
) {
    const dispatch = useDispatch();
    const stateRef = useRef({});
    const isDrawingRef = useRef(false);

    function clearPreview() {
        const canvas = previewCanvasRef.current;
        const ctx = previewCtxRef.current;
        if (!canvas || !ctx) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    const Impl =
        (shapeKey === 'line' && SHAPE_FEATURE.LineShape) ||
        (shapeKey === 'rect' && SHAPE_FEATURE.RectShape) ||
        (shapeKey === 'circle' && SHAPE_FEATURE.CircleShape) ||
        (shapeKey === 'curve' && SHAPE_FEATURE.CurveShape) ||
        SHAPE_FEATURE.LineShape;

    function onPointerDown(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        const host = e.currentTarget;
        const pctx = previewCtxRef.current;
        if (!host || !pctx) return;

        if (e.cancelable) e.preventDefault();
        host.setPointerCapture?.(e.pointerId);

        const p = getCanvasPosition(host, e);
        Impl.begin(pctx, p, strokeWidth, strokeColor, stateRef.current);
        isDrawingRef.current = true;
    }

    function onPointerMove(e) {
        if (!isDrawingRef.current) return;
        const host = e.currentTarget;
        const pctx = previewCtxRef.current;
        if (!host || !pctx) return;

        if (e.cancelable) e.preventDefault();
        const p = getCanvasPosition(host, e);

        clearPreview();
        getOverlayDesign(previewCtxRef, () => {
            Impl.draw(pctx, p, strokeWidth, strokeColor, stateRef.current);
        });
    }

    function onPointerUp(e) {
        if (!isDrawingRef.current) return;

        const host = e.currentTarget;
        const pctx = previewCtxRef.current;
        if (!host || !pctx) return;

        if (e?.cancelable) e.preventDefault();
        const p = getCanvasPosition(host, e);

        const result = Impl.end(
            pctx,
            p,
            strokeWidth,
            strokeColor,
            stateRef.current
        );

        // curve 2단계 지원
        if (result?.pending) {
            isDrawingRef.current = false;
            return;
        }

        // ✅ 확정 시: Redux에만 저장 → Vector 컴포넌트가 상태 기반 재그리기
        if (result?.shape) {
            const base = {
                id: uid(),
                ...result.shape, // type/좌표/선색/굵기 등
            };
            // 채우기는 옵션일 때만
            const shape =
                fillEnabled && fillColor && fillColor !== 'transparent'
                    ? { ...base, fill: fillColor }
                    : base;

            dispatch(addShape(shape));
        }

        clearPreview();
        stateRef.current = {};
        isDrawingRef.current = false;
    }

    const onPointerLeave = onPointerUp;
    const onPointerCancel = onPointerUp;

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerLeave,
        onPointerCancel,
    };
}
