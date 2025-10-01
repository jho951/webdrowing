/**
 * @file get-bitmap-undo-redo.js
 * @description 비트맵(ImageData 기반) undo/redo 유틸 (툴바 버튼 폴백 경로)
 */
import {
    pushPastBitmap,
    pushFutureBitmap,
    popPastBitmap,
    popFutureBitmap,
} from '../redux/slice/historySlice';
import { commitBitmap } from '../redux/slice/bitmapSlice';

/**
 * 현재 캔버스를 ImageData로 스냅샷
 */
function captureImageData(ctx) {
    if (!ctx) return null;
    return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * ImageData를 캔버스에 복원
 */
function restoreImageData(ctx, imageData) {
    if (!ctx || !imageData) return;
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Undo: past의 마지막을 복원하고, 현재 프레임을 future로 보존
 */
export function undoBitmap(ctx) {
    return (dispatch, getState) => {
        if (!ctx) return;

        const state = getState();
        const past = state?.history?.bitmap?.past || [];
        if (past.length === 0) return;

        const cur = captureImageData(ctx);
        if (cur) dispatch(pushFutureBitmap({ snapshot: cur }));

        const prevEntry = past[past.length - 1];
        const prev = prevEntry?.snapshot ?? prevEntry;

        dispatch(popPastBitmap());
        restoreImageData(ctx, prev);
        dispatch(commitBitmap({ snapshot: prev }));
    };
}

/**
 * Redo: future의 마지막을 복원하고, 현재 프레임을 past로 보존
 */
export function redoBitmap(ctx) {
    return (dispatch, getState) => {
        if (!ctx) return;

        const state = getState();
        const future = state?.history?.bitmap?.future || [];
        if (future.length === 0) return;

        const cur = captureImageData(ctx);
        if (cur) dispatch(pushPastBitmap({ snapshot: cur }));

        const nextEntry = future[future.length - 1];
        const next = nextEntry?.snapshot ?? nextEntry;

        dispatch(popFutureBitmap());
        restoreImageData(ctx, next);
        dispatch(commitBitmap({ snapshot: next }));
    };
}
