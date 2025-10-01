/**
 * @file historyVectorMiddleware.js
 * @description shape 변경 이전 스냅샷을 historyVector.past에 자동 커밋
 */
import { pushPastV } from '../slice/vectorSlice';
import {
    addShape,
    updateShape,
    removeShape,
    clearShapes,
    setShapes,
    updateShapeTransform,
} from '../slice/shapeSlice';

const MUTATION = new Set([
    addShape.type,
    updateShape.type,
    removeShape.type,
    clearShapes.type,
    setShapes.type,
    updateShapeTransform.type,
]);

export const historyVectorMiddleware = (store) => (next) => (action) => {
    const isRestore = action?.meta?.historyRestore === true;
    if (!MUTATION.has(action.type) || isRestore) {
        return next(action);
    }

    const prev = store.getState()?.shape?.items ?? [];
    const prevSnap = prev.map((it) => ({ ...it }));

    const result = next(action);

    const cur = store.getState()?.shape?.items ?? [];
    if (prev !== cur) {
        store.dispatch(pushPastV(prevSnap));
    }
    return result;
};
