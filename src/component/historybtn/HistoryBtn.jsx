/**
 * @file HistoryBtn.jsx
 * @description 단일 Undo/Redo 버튼 (shape|text → Vector 우선, 그 외 → Bitmap 우선)
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectGlobalMode } from '../../redux/slice/modeSlice';
import {
    canUndoBitmap as selCanUndoBmp,
    canRedoBitmap as selCanRedoBmp,
    canUndoVector as selCanUndoVec,
    canRedoVector as selCanRedoVec,
} from '../../redux/slice/historySlice';

import { undoVector, redoVector } from '../../util/get-vector-undo-redo';
import {
    undoBitmap as thunkUndoBitmap,
    redoBitmap as thunkRedoBitmap,
} from '../../util/get-bitmap-undo-redo';

/**
 * @param {object} props
 * @param {object|null} props.bitmapApi - useBitmap(...) 반환값(undo/redo/canUndo/canRedo 포함)
 * @param {object|null} props.bitmapCtxRef - 훅 API가 없을 때 폴백용 2D 컨텍스트 ref
 */
function HistoryBtn({ bitmapApi = null, bitmapCtxRef = null, className = '' }) {
    const dispatch = useDispatch();
    const mode = useSelector(selectGlobalMode);

    const canUndoBmpStore = useSelector(selCanUndoBmp);
    const canRedoBmpStore = useSelector(selCanRedoBmp);
    const canUndoVec = useSelector(selCanUndoVec);
    const canRedoVec = useSelector(selCanRedoVec);

    const canUndoBmp = (bitmapApi?.canUndo ?? canUndoBmpStore) || false;
    const canRedoBmp = (bitmapApi?.canRedo ?? canRedoBmpStore) || false;

    const isVectorMode = mode === 'shape' || mode === 'text';
    const canUndoAny = isVectorMode
        ? canUndoVec || canUndoBmp
        : canUndoBmp || canUndoVec;
    const canRedoAny = isVectorMode
        ? canRedoVec || canRedoBmp
        : canRedoBmp || canRedoVec;

    const doUndo = useCallback(() => {
        if (isVectorMode) {
            if (canUndoVec) return dispatch(undoVector());
            if (canUndoBmp) {
                if (bitmapApi?.undo) return bitmapApi.undo();
                const ctx = bitmapCtxRef?.current ?? null;
                if (ctx) return dispatch(thunkUndoBitmap(ctx));
            }
        } else {
            if (canUndoBmp) {
                if (bitmapApi?.undo) return bitmapApi.undo();
                const ctx = bitmapCtxRef?.current ?? null;
                if (ctx) return dispatch(thunkUndoBitmap(ctx));
            }
            if (canUndoVec) return dispatch(undoVector());
        }
    }, [
        dispatch,
        isVectorMode,
        canUndoVec,
        canUndoBmp,
        bitmapApi,
        bitmapCtxRef,
    ]);

    const doRedo = useCallback(() => {
        if (isVectorMode) {
            if (canRedoVec) return dispatch(redoVector());
            if (canRedoBmp) {
                if (bitmapApi?.redo) return bitmapApi.redo();
                const ctx = bitmapCtxRef?.current ?? null;
                if (ctx) return dispatch(thunkRedoBitmap(ctx));
            }
        } else {
            if (canRedoBmp) {
                if (bitmapApi?.redo) return bitmapApi.redo();
                const ctx = bitmapCtxRef?.current ?? null;
                if (ctx) return dispatch(thunkRedoBitmap(ctx));
            }
            if (canRedoVec) return dispatch(redoVector());
        }
    }, [
        dispatch,
        isVectorMode,
        canRedoVec,
        canRedoBmp,
        bitmapApi,
        bitmapCtxRef,
    ]);

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
            } else if ((k === 'z' && e.shiftKey) || k === 'y') {
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
                aria-label="Undo (Ctrl/⌘+Z)"
                title="Undo (Ctrl/⌘+Z)"
            >
                Undo
            </button>
            <button
                onClick={doRedo}
                disabled={!canRedoAny}
                className="history-btn"
                aria-label="Redo (Ctrl/⌘+Shift+Z or Ctrl+Y)"
                title="Redo (Ctrl/⌘+Shift+Z or Ctrl+Y)"
            >
                Redo
            </button>
        </section>
    );
}

export default HistoryBtn;
