/**
 * @file historyVectorThunks.js
 */
import {
    popPastV,
    popFutureV,
    pushFutureV,
    pushPastVNoClear,
} from './vectorSlice';

export const undoVector = () => (dispatch, getState) => {
    const { historyVector, shape } = getState();
    if (!historyVector?.past?.length) return;

    const prev = historyVector.past[historyVector.past.length - 1];
    const current = shape?.items ?? [];

    dispatch(pushFutureV(current.map((it) => ({ ...it }))));
    dispatch(popPastV());
    dispatch({
        type: 'shape/setShapes',
        payload: prev,
        meta: { historyRestore: true },
    });
};

// ✅ Redo는 current를 past에 넣되, future는 유지해야 함
export const redoVector = () => (dispatch, getState) => {
    const { historyVector, shape } = getState();
    if (!historyVector?.future?.length) return;

    const nextSnap = historyVector.future[historyVector.future.length - 1];
    const current = shape?.items ?? [];

    dispatch(popFutureV());

    dispatch(pushPastVNoClear(current.map((it) => ({ ...it }))));

    dispatch({
        type: 'shape/setShapes',
        payload: nextSnap,
        meta: { historyRestore: true },
    });
};
