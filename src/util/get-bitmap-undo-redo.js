// src/util/get-bitmap-undo-redo.js
import {
    pushFutureBitmap,
    pushPastBitmap,
    popPastBitmap,
    popFutureBitmap,
} from '../redux/slice/historySlice';
import { commitBitmap } from '../redux/slice/bitmapSlice';

/** 현재 캔버스 픽셀 스냅샷 */
function capture(ctx) {
    const c = ctx?.canvas;
    if (!ctx || !c) return null;
    return ctx.getImageData(0, 0, c.width, c.height);
}

/** 스냅샷을 캔버스에 복원 */
function drawSnapshot(ctx, img) {
    if (!ctx || !img) return;
    const c = ctx.canvas;
    const sameSize = img.width === c.width && img.height === c.height;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!sameSize) {
        // 크기 다르면 임시 캔버스에 putImageData → drawImage로 스케일 복원
        const tmp = document.createElement('canvas');
        tmp.width = img.width;
        tmp.height = img.height;
        tmp.getContext('2d').putImageData(img, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(
            tmp,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            c.width,
            c.height
        );
    } else {
        ctx.putImageData(img, 0, 0);
    }
    ctx.restore();
}

/**
 * Undo (Bitmap) — thunk creator
 * @param {CanvasRenderingContext2D} ctx
 */
export const undoBitmap = (ctx) => (dispatch, getState) => {
    if (!ctx) return;
    const past = getState()?.history?.bitmap?.past || [];
    if (past.length === 0) return;

    const cur = capture(ctx);
    if (cur) dispatch(pushFutureBitmap({ snapshot: cur }));

    const prevEntry = past[past.length - 1];
    const prev = prevEntry?.snapshot ?? prevEntry;

    dispatch(popPastBitmap());
    drawSnapshot(ctx, prev);
    dispatch(commitBitmap({ snapshot: prev }));
};

/**
 * Redo (Bitmap) — thunk creator
 * @param {CanvasRenderingContext2D} ctx
 */
export const redoBitmap = (ctx) => (dispatch, getState) => {
    if (!ctx) return;
    const future = getState()?.history?.bitmap?.future || [];
    if (future.length === 0) return;

    const cur = capture(ctx);
    if (cur) dispatch(pushPastBitmap({ snapshot: cur }));

    const nextEntry = future[future.length - 1];
    const next = nextEntry?.snapshot ?? nextEntry;

    dispatch(popFutureBitmap());
    drawSnapshot(ctx, next);
    dispatch(commitBitmap({ snapshot: next }));
};
