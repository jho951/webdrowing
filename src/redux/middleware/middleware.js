/**
 * @file historyOrchestrator.js
 * @author YJH
 */
import {
  pushSnapshot,
  undo,
  redo,
  selectCurrentSnapshot,
} from '../slice/historySlice';
import { replaceAll as replaceVector } from '../slice/vectorSlice';
import { replace as replaceSelection } from '../slice/selectSlice';
import { bitmapHistory } from '../../util/bitmap-history';

const TRACKED_TYPES = new Set([
  'vector/addShape',
  'vector/updateShape',
  'vector/removeShape',
  'selection/setSelection',
  'selection/resetSelection',
]);

let isRestoring = false;

export const historyOrchestrator = (store) => (next) => (action) => {
  if (isRestoring) return next(action);

  const out = next(action);

  if (TRACKED_TYPES.has(action.type)) {
    const st = store.getState();
    store.dispatch(
      pushSnapshot({
        vector: st.vector,
        selection: st.selection,
      })
    );
  }

  if (action.type === undo.type || action.type === redo.type) {
    const st = store.getState();
    const snap = selectCurrentSnapshot(st);
    if (snap) {
      isRestoring = true;
      try {
        if (snap.vector) store.dispatch(replaceVector(snap.vector));
        if (snap.selection) store.dispatch(replaceSelection(snap.selection));
      } finally {
        isRestoring = false;
      }
    }

    const bmp = bitmapHistory(10);
    if (action.type === undo.type) bmp.undo();
    if (action.type === redo.type) bmp.redo();
  }

  return out;
};
