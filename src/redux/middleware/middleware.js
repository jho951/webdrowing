/**
 * @file historyOrchestrator.js
 * @author YJH
 */
import {
  pushSnapshot,
  redo,
  undo,
  selectCurrentSnapshot,
} from '@/redux/slice/historySlice';
import { replaceAll as replaceVector } from '@/redux/slice/vectorSlice';
import { replaceAll as replaceText } from '@/redux/slice/textSlice';
import { replaceAll as replaceImage } from '@/redux/slice/imageSlice';
import { replace as replaceSelection } from '@/redux/slice/selectSlice';
import { bitmapHistory } from '@/util/bitmap-history';

/**
 * @description 어떤 액션을 추적할지 정의
 */
const TRACKED_TYPES = new Set([
  'vector/addShape',
  'vector/updateShape',
  'vector/removeShape',
  'text/addText',
  'text/updateText',
  'text/removeText',
  'image/addImage',
  'image/updateImage',
  'image/removeImage',
  'selection/setSelection',
  'selection/clearSelection',
]);

/**
 * @description 히스토리 미들웨어
 */
const historyOrchestrator = (store) => (next) => (action) => {
  const out = next(action);

  if (TRACKED_TYPES.has(action.type)) {
    const st = store.getState();
    const snapshot = {
      vector: st.vector,
      text: st.text,
      image: st.image,
      selection: st.selection,
    };
    store.dispatch(pushSnapshot(snapshot));
  }

  if (action.type === undo.type || action.type === redo.type) {
    const st = store.getState();
    const snap = selectCurrentSnapshot(st);
    if (snap) {
      store.dispatch(replaceVector(snap.vector));
      store.dispatch(replaceText(snap.text));
      store.dispatch(replaceImage(snap.image));
      store.dispatch(replaceSelection(snap.selection));
    }
    const history = bitmapHistory(10);
    if (action.type === undo.type) history.undo();
    if (action.type === redo.type) history.redo();
  }

  return out;
};

export { historyOrchestrator };
