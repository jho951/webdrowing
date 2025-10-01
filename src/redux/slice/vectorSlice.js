import { createSlice } from '@reduxjs/toolkit';

const MAX_STACK = 100;

const slice = createSlice({
    name: 'historyVector',
    initialState: { past: [], future: [] },
    reducers: {
        pushPastV(state, { payload }) {
            const snap = Array.isArray(payload) ? payload : [];
            state.past.push(snap);
            if (state.past.length > MAX_STACK) state.past.shift();
            state.future = [];
        },
        popPastV(state) {
            state.past.pop();
        },
        pushFutureV(state, { payload }) {
            const snap = Array.isArray(payload) ? payload : [];
            state.future.push(snap);
            if (state.future.length > MAX_STACK) state.future.shift();
        },
        pushPastVNoClear(state, { payload }) {
            const snap = Array.isArray(payload) ? payload : [];
            state.past.push(snap);
            if (state.past.length > MAX_STACK) state.past.shift();
        },
        popFutureV(state) {
            state.future.pop();
        },
        clearVectorHistory(state) {
            state.past = [];
            state.future = [];
        },
    },
});

export const {
    pushPastV,
    popPastV,
    pushFutureV,
    popFutureV,
    clearVectorHistory,
    pushPastVNoClear,
} = slice.actions;

export default slice.reducer;
export const selectVectorCanUndo = (s) =>
    (s.historyVector?.past?.length ?? 0) > 0;

export const selectVectorCanRedo = (s) =>
    (s.historyVector?.future?.length ?? 0) > 0;
