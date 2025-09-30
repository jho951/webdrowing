/**
 * @file HistoryBtn.jsx
 * @description 단일 Undo/Redo 버튼 (shape|text → Vector 우선, 그 외 → Bitmap 우선)
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectGlobalMode } from '../../redux/slice/modeSlice';

// ✅ ops 경로에서 가져오세요 (slice 아님)
import { undoBitmap, redoBitmap } from '../../util/get-bitmap-undo-redo';
import { undoVector, redoVector } from '../../util/get-vector-undo-redo';

import {
    canUndoBitmap as selCanUndoBmp,
    canRedoBitmap as selCanRedoBmp,
    canUndoVector as selCanUndoVec,
    canRedoVector as selCanRedoVec,
} from '../../redux/slice/historySlice';

function HistoryBtn({ bitmapCtxRef, className = '' }) {
    const dispatch = useDispatch();
    const mode = useSelector(selectGlobalMode);

    const canUndoBmp = useSelector(selCanUndoBmp);
    const canRedoBmp = useSelector(selCanRedoBmp);
    const canUndoVec = useSelector(selCanUndoVec);
    const canRedoVec = useSelector(selCanRedoVec);

    const isVectorMode = mode === 'shape' || mode === 'text';
    const canUndoAny = isVectorMode
        ? canUndoVec || canUndoBmp
        : canUndoBmp || canUndoVec;
    const canRedoAny = isVectorMode
        ? canRedoVec || canRedoBmp
        : canRedoBmp || canRedoVec;

    const doUndo = useCallback(() => {
        const ctx = bitmapCtxRef?.current || null;
        if (isVectorMode) {
            if (canUndoVec) return dispatch(undoVector());
            if (canUndoBmp && ctx) return dispatch(undoBitmap(ctx));
        } else {
            if (canUndoBmp && ctx) return dispatch(undoBitmap(ctx));
            if (canUndoVec) return dispatch(undoVector());
        }
    }, [dispatch, isVectorMode, canUndoVec, canUndoBmp, bitmapCtxRef]);

    const doRedo = useCallback(() => {
        const ctx = bitmapCtxRef?.current || null;
        if (isVectorMode) {
            if (canRedoVec) return dispatch(redoVector());
            if (canRedoBmp && ctx) return dispatch(redoBitmap(ctx));
        } else {
            if (canRedoBmp && ctx) return dispatch(redoBitmap(ctx));
            if (canRedoVec) return dispatch(redoVector());
        }
    }, [dispatch, isVectorMode, canRedoVec, canRedoBmp, bitmapCtxRef]);

    useEffect(() => {
        const onKeyDown = (e) => {
            const t = e.target;
            if (
                t &&
                (t.tagName === 'INPUT' ||
                    t.tagName === 'TEXTAREA' ||
                    t.isContentEditable)
            )
                return;

            const isMeta = e.metaKey || e.ctrlKey;
            if (!isMeta) return;

            const k = e.key.toLowerCase();
            if (k === 'z' && !e.shiftKey) {
                if (canUndoAny) {
                    e.preventDefault();
                    doUndo();
                }
            } else if (k === 'z' && e.shiftKey) {
                if (canRedoAny) {
                    e.preventDefault();
                    doRedo();
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [doUndo, doRedo, canUndoAny, canRedoAny]);

    return (
        <section className={`history-controls ${className}`}>
            <button
                onClick={doUndo}
                disabled={!canUndoAny}
                className="history-btn"
            >
                ⟲ Undo
            </button>
            <button
                onClick={doRedo}
                disabled={!canRedoAny}
                className="history-btn"
            >
                ⟳ Redo
            </button>
        </section>
    );
}

export default HistoryBtn;
