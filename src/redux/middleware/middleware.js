/**
 * @file historyOrchestrator.js
 * @author YJH
 */
import {
  pushSnapshot,
  undoBitmap,
  redoBitmap,
  selectCurrentSnapshot,
} from '../slice/historySlice';

import { replaceAll as replaceVector } from '../slice/vectorSlice';
import { replace as replaceSelection } from '../slice/selectSlice';

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

  // 🎯 벡터/선택 관련 액션 발생 시 snapshot 저장
  if (TRACKED_TYPES.has(action.type)) {
    const st = store.getState();
    store.dispatch(
      pushSnapshot({
        vector: st.vector,
        selection: st.selection,
      })
    );
  }

  // 🎯 undo / redo 동작 처리
  if (action.type === 'history/undo' || action.type === 'history/redo') {
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

    // 캔버스 bitmap은 thunk로 처리
    if (action.type === 'history/undo') {
      store.dispatch(undoBitmap());
    } else if (action.type === 'history/redo') {
      store.dispatch(redoBitmap());
    }
  }

  return out;
};
