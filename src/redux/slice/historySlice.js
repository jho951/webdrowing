/**
 * @file historySlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { HISTORY } from '../../constant/history';

const makeChannel = () => ({
    past: [],
    future: [],
    limit: HISTORY.DEFAULT_LIMIT,
    applied: null, // ← pop 결과를 임시 보관
});

const initialState = {
    bitmap: makeChannel(),
    vector: makeChannel(),
};

const historySlice = createSlice({
    name: HISTORY.HISTORY_TYPE,
    initialState,
    reducers: {
        pushPastBitmap(state, { payload }) {
            state.bitmap.past.push(payload);
            if (state.bitmap.past.length > state.bitmap.limit)
                state.bitmap.past.shift();
            state.bitmap.future = [];
        },
        popPastBitmap(state) {
            const snapped = state.bitmap.past.pop() || null;
            state.bitmap.applied = snapped;
        },
        pushFutureBitmap(state, { payload }) {
            state.bitmap.future.push(payload);
            if (state.bitmap.future.length > state.bitmap.limit)
                state.bitmap.future.shift();
        },
        popFutureBitmap(state) {
            const snapped = state.bitmap.future.pop() || null;
            state.bitmap.applied = snapped;
        },
        clearBitmapHistory(state) {
            state.bitmap = makeChannel();
        },

        pushPastVector(state, { payload }) {
            state.vector.past.push(payload);
            if (state.vector.past.length > state.vector.limit)
                state.vector.past.shift();
            state.vector.future = [];
        },
        popPastVector(state) {
            state.vector.applied = state.vector.past.pop() || null;
        },
        pushFutureVector(state, { payload }) {
            state.vector.future.push(payload);
            if (state.vector.future.length > state.vector.limit)
                state.vector.future.shift();
        },
        popFutureVector(state) {
            state.vector.applied = state.vector.future.pop() || null;
        },
        clearVectorHistory(state) {
            state.vector = makeChannel();
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

export const selectBitmapHistory = (s) => s.history.bitmap;
export const canUndoBitmap = (s) => s.history.bitmap.past.length > 0;
export const canRedoBitmap = (s) => s.history.bitmap.future.length > 0;
export const selectBitmapApplied = (s) => s.history.bitmap.applied;

export const selectVectorHistory = (s) => s.history.vector;
export const canUndoVector = (s) => s.history.vector.past.length > 0;
export const canRedoVector = (s) => s.history.vector.future.length > 0;
export const selectVectorApplied = (s) => s.history.vector.applied;
