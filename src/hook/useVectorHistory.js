/**
 * @file useVectorHistory.js
 * @description 벡터 도형 undo/redo 전용 훅 (historySlice.vector 채널 사용)
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    pushPastVector,
    pushFutureVector,
    popPastVector,
    popFutureVector,
    selectVectorHistory,
    canUndoVector as selCanUndoVector,
    canRedoVector as selCanRedoVector,
} from '../redux/slice/historySlice';
import { setShapes, selectVectorItems } from '../redux/slice/shapeSlice';

export function useVectorHistory() {
    const dispatch = useDispatch();
    const hist = useSelector(selectVectorHistory);
    const items = useSelector(selectVectorItems);
    const canUndo = useSelector(selCanUndoVector);
    const canRedo = useSelector(selCanRedoVector);

    // 변경 직전 스냅샷을 past에 쌓고 싶을 때 호출
    const capture = useCallback(() => {
        // 깊은 복사가 안전(참조 공유 방지)
        const snap = JSON.parse(JSON.stringify(items || []));
        dispatch(pushPastVector({ snapshot: snap }));
        // future는 리듀서에서 자동으로 비워짐
    }, [dispatch, items]);

    const undo = useCallback(() => {
        const past = hist?.past || [];
        if (past.length === 0) return;

        // 현재 상태를 future로
        const cur = JSON.parse(JSON.stringify(items || []));
        dispatch(pushFutureVector({ snapshot: cur }));

        const prevEntry = past[past.length - 1];
        const prev = prevEntry?.snapshot ?? prevEntry;

        dispatch(popPastVector());
        dispatch(setShapes(Array.isArray(prev) ? prev : []));
    }, [dispatch, hist?.past, items]);

    const redo = useCallback(() => {
        const future = hist?.future || [];
        if (future.length === 0) return;

        // 현재 상태를 past로
        const cur = JSON.parse(JSON.stringify(items || []));
        dispatch(pushPastVector({ snapshot: cur }));

        const nextEntry = future[future.length - 1];
        const next = nextEntry?.snapshot ?? nextEntry;

        dispatch(popFutureVector());
        dispatch(setShapes(Array.isArray(next) ? next : []));
    }, [dispatch, hist?.future, items]);

    return { capture, undo, redo, canUndo, canRedo };
}
