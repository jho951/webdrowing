/**
 * @file get-vector-undo-redo.js
 * @description 벡터(도형) 전용 undo/redo thunk와 스냅샷 헬퍼 (historySlice의 pushPast/popPast 이름에 맞춤)
 */
import {
    pushPastVector,
    pushFutureVector,
    popPastVector,
    popFutureVector,
    selectVectorPastTop,
    selectVectorFutureTop,
} from '../redux/slice/historySlice';

import { selectVectorItems, setShapes } from '../redux/slice/shapeSlice';

// 깊은 복사(구현 간단 버전)
const clone = (x) =>
    typeof structuredClone === 'function'
        ? structuredClone(x)
        : JSON.parse(JSON.stringify(x));

// 드로잉/변형 1동작 끝날 때 past에 스냅샷 푸시
export function commitVectorSnapshot() {
    return (dispatch, getState) => {
        const items = selectVectorItems(getState()) || [];
        dispatch(pushPastVector(clone(items)));
    };
}

// Undo
export function undoVector() {
    return (dispatch, getState) => {
        const state = getState();
        const top = selectVectorPastTop(state);
        if (!top) return;

        // 현재 상태를 future에 저장
        const cur = selectVectorItems(state) || [];
        dispatch(pushFutureVector(clone(cur)));

        // past pop → 복원
        dispatch(popPastVector());
        dispatch(setShapes(clone(top)));
    };
}

// Redo
export function redoVector() {
    return (dispatch, getState) => {
        const state = getState();
        const top = selectVectorFutureTop(state);
        if (!top) return;

        // 현재 상태를 past에 저장
        const cur = selectVectorItems(state) || [];
        dispatch(pushPastVector(clone(cur)));

        // future pop → 복원
        dispatch(popFutureVector());
        dispatch(setShapes(clone(top)));
    };
}
