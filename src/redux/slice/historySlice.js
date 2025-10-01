/**
 * @file historySlice.js
 */
import { createSlice } from '@reduxjs/toolkit';
import { HISTORY } from '../../constant/history';

const makeChannel = (limit = HISTORY.DEFAULT_LIMIT) => ({
    past: [],
    future: [],
    limit,
});

const initialState = {
    bitmap: makeChannel(),
    vector: makeChannel(),
};

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        // ---- Bitmap ----
        pushPastBitmap(state, { payload }) {
            state.bitmap.past.push(payload);
            if (state.bitmap.past.length > state.bitmap.limit)
                state.bitmap.past.shift();
            state.bitmap.future = [];
        },
        popPastBitmap(state) {
            if (state.bitmap.past.length) state.bitmap.past.pop();
        },
        pushFutureBitmap(state, { payload }) {
            state.bitmap.future.push(payload);
            if (state.bitmap.future.length > state.bitmap.limit)
                state.bitmap.future.shift();
        },
        popFutureBitmap(state) {
            if (state.bitmap.future.length) state.bitmap.future.pop();
        },
        clearBitmapHistory(state) {
            state.bitmap = makeChannel(state.bitmap.limit);
        },

        // ---- Vector ----
        pushPastVector(state, { payload }) {
            state.vector.past.push(payload);
            if (state.vector.past.length > state.vector.limit)
                state.vector.past.shift();
            state.vector.future = [];
        },
        popPastVector(state) {
            if (state.vector.past.length) state.vector.past.pop();
        },
        pushFutureVector(state, { payload }) {
            state.vector.future.push(payload);
            if (state.vector.future.length > state.vector.limit)
                state.vector.future.shift();
        },
        popFutureVector(state) {
            if (state.vector.future.length) state.vector.future.pop();
        },
        clearVectorHistory(state) {
            state.vector = makeChannel(state.vector.limit);
        },
    },
});

export const {
    pushPastBitmap,
    pushFutureBitmap,
    popPastBitmap,
    popFutureBitmap,
    clearBitmapHistory,
    pushPastVector,
    pushFutureVector,
    popPastVector,
    popFutureVector,
    clearVectorHistory,
} = historySlice.actions;

export default historySlice.reducer;

// ===== Selectors =====
export const selectBitmapHistory = (s) => s.history.bitmap;
export const selectVectorHistory = (s) => s.history.vector;

export const canUndoBitmap = (s) => (s.history.bitmap.past.length ?? 0) > 0;
export const canRedoBitmap = (s) => (s.history.bitmap.future.length ?? 0) > 0;
export const canUndoVector = (s) => (s.history.vector.past.length ?? 0) > 0;
export const canRedoVector = (s) => (s.history.vector.future.length ?? 0) > 0;

export const selectBitmapPastTop = (s) => {
    const a = s.history.bitmap.past;
    return a[a.length - 1] ?? null;
};
export const selectBitmapFutureTop = (s) => {
    const a = s.history.bitmap.future;
    return a[a.length - 1] ?? null;
};
export const selectVectorPastTop = (s) => {
    const a = s.history.vector.past;
    return a[a.length - 1] ?? null;
};
export const selectVectorFutureTop = (s) => {
    const a = s.history.vector.future;
    return a[a.length - 1] ?? null;
};
