// src/util/get-vector-undo-redo.js
import {
    pushFutureVector,
    pushPastVector,
    popPastVector,
    popFutureVector,
} from '../redux/slice/historySlice';
import { setShapes } from '../redux/slice/shapeSlice';

const deepCopy = (v) => JSON.parse(JSON.stringify(v || []));

/** 변경 직전 상태를 past에 저장 (도형/텍스트 확정 직전에 호출) */
export const captureVector = () => (dispatch, getState) => {
    const items = getState()?.shape?.items || [];
    dispatch(pushPastVector({ snapshot: deepCopy(items) }));
};

export const undoVector = () => (dispatch, getState) => {
    const state = getState();
    const past = state?.history?.vector?.past || [];
    if (past.length === 0) return;

    const cur = deepCopy(state?.shape?.items || []);
    dispatch(pushFutureVector({ snapshot: cur }));

    const prevEntry = past[past.length - 1];
    const prev = prevEntry?.snapshot ?? prevEntry;

    dispatch(popPastVector());
    dispatch(setShapes(Array.isArray(prev) ? prev : []));
};

export const redoVector = () => (dispatch, getState) => {
    const state = getState();
    const future = state?.history?.vector?.future || [];
    if (future.length === 0) return;

    const cur = deepCopy(state?.shape?.items || []);
    dispatch(pushPastVector({ snapshot: cur }));

    const nextEntry = future[future.length - 1];
    const next = nextEntry?.snapshot ?? nextEntry;

    dispatch(popFutureVector());
    dispatch(setShapes(Array.isArray(next) ? next : []));
};
