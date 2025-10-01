/**
 * @file useBitmap.js
 * @description 비트맵 드로잉 + 히스토리(undo/redo)
 * - ImageData 전용 (간단/빠름)
 * - historySlice(past/future) + bitmapSlice(snapshot) 사용
 */

import { useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    pushPastBitmap,
    pushFutureBitmap,
    popPastBitmap,
    popFutureBitmap,
    selectBitmapHistory,
    canUndoBitmap as selCanUndo,
    canRedoBitmap as selCanRedo,
} from '../redux/slice/historySlice';
import { commitBitmap } from '../redux/slice/bitmapSlice';
import { getCanvasPosition } from '../util/canvas-helper';
import { ToolMap } from '../feature/tool';

export function useBitmap(
    bitmapCanvasRef,
    bitmapCtxRef,
    { tool, color, width } = {}
) {
    const dispatch = useDispatch();
    const history = useSelector(selectBitmapHistory);
    const canUndo = useSelector(selCanUndo);
    const canRedo = useSelector(selCanRedo);

    const isDrawingRef = useRef(false);

    // bitmap ctx 가져오기 (없으면 즉시 생성)
    const getCtx = () =>
        bitmapCtxRef?.current || bitmapCanvasRef?.current?.getContext('2d');

    // === 스냅샷 ===
    const capture = useCallback(() => {
        const canvas = bitmapCanvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return null;
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }, [bitmapCanvasRef, bitmapCtxRef]);

    const drawSnapshot = useCallback(
        (img) => {
            const ctx = getCtx();
            if (!ctx || !img) return;
            ctx.putImageData(img, 0, 0);
        },
        [bitmapCtxRef]
    );

    // === 포인터 핸들러 (Overlay가 이벤트 호스트) ===
    const onPointerDown = useCallback(
        (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            // 이벤트를 받은 overlay 캔버스 (좌표 및 캡처 기준은 host)
            const host = e.currentTarget; // HTMLCanvasElement
            const ctx = getCtx();
            if (!host || !ctx) return;

            const impl = ToolMap?.[tool];
            if (!impl) return;

            if (e.cancelable) e.preventDefault();
            host.setPointerCapture?.(e.pointerId);

            const p = getCanvasPosition(host, e);

            const lineWidth = Number(width ?? 3);
            const stroke =
                typeof color === 'object'
                    ? color?.value || '#000000'
                    : color || '#000000';

            if (tool === 'brush') impl.begin(ctx, p, lineWidth, stroke);
            else impl.begin(ctx, p, lineWidth);

            isDrawingRef.current = true;
        },
        [bitmapCtxRef, tool, color, width]
    );

    const onPointerMove = useCallback(
        (e) => {
            if (!isDrawingRef.current) return;

            const host = e.currentTarget;
            const ctx = getCtx();
            if (!host || !ctx) return;

            const impl = ToolMap?.[tool];
            if (!impl) return;

            if (e.cancelable) e.preventDefault();
            const p = getCanvasPosition(host, e);
            impl.draw(ctx, p);
        },
        [bitmapCtxRef, tool]
    );

    const endDraw = useCallback(
        (e) => {
            if (!isDrawingRef.current) return;
            const ctx = getCtx();
            if (!ctx) return;

            if (e?.cancelable) e.preventDefault();

            const impl = ToolMap?.[tool];
            impl?.end?.(ctx);
            isDrawingRef.current = false;

            const snap = capture();
            if (!snap) return;

            // past에 push (future는 리듀서에서 비워짐) + 현재 1장 커밋
            dispatch(pushPastBitmap({ snapshot: snap }));
            dispatch(commitBitmap({ snapshot: snap }));
        },
        [tool, capture, dispatch]
    );

    // 최초 기준 한 장 넣고 싶을 때 (마운트 직후 등)
    const commitCurrentAsBase = useCallback(() => {
        const snap = capture();
        if (!snap) return;
        dispatch(pushPastBitmap({ snapshot: snap }));
        dispatch(commitBitmap({ snapshot: snap }));
    }, [capture, dispatch]);

    // === Undo/Redo ===
    const undo = useCallback(() => {
        const past = history?.past || [];
        if (past.length === 0) return;

        // 현재 장면을 future로 보존
        const cur = capture();
        if (cur) dispatch(pushFutureBitmap({ snapshot: cur }));

        // 미리 꺼내서 즉시 복원
        const prevEntry = past[past.length - 1];
        const prev = prevEntry?.snapshot ?? prevEntry;

        dispatch(popPastBitmap());
        drawSnapshot(prev);
        dispatch(commitBitmap({ snapshot: prev }));
    }, [history, capture, drawSnapshot, dispatch]);

    const redo = useCallback(() => {
        const future = history?.future || [];
        if (future.length === 0) return;

        // 현재 장면을 past로 보존
        const cur = capture();
        if (cur) dispatch(pushPastBitmap({ snapshot: cur }));

        // 미리 꺼내서 즉시 복원
        const nextEntry = future[future.length - 1];
        const next = nextEntry?.snapshot ?? nextEntry;

        dispatch(popFutureBitmap());
        drawSnapshot(next);
        dispatch(commitBitmap({ snapshot: next }));
    }, [history, capture, drawSnapshot, dispatch]);

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp: endDraw,
        onPointerLeave: endDraw,
        onPointerCancel: endDraw,

        commitCurrentAsBase,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}
