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
import { replaceAll as replaceText } from '../slice/textSlice';
import { replaceAll as replaceImage } from '../slice/imageSlice';
import { replace as replaceSelection } from '../slice/selectSlice';
import { bitmapHistory } from '../../util/bitmap/bitmap-history';

/**
 * @description 어떤 액션을 추적할지 정의(결과물만 추적; 모드 전환 등은 제외)
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
 * @description 복원(replace*) 중에는 스냅샷을 쌓지 않기 위한 가드
 */
let isRestoring = false;

/**
 * @description 히스토리 미들웨어
 */
const historyOrchestrator = (store) => (next) => (action) => {
  // 복원 중에는 그대로 통과시켜 스냅샷을 쌓지 않음
  if (isRestoring) {
    return next(action);
  }

  // 1) 액션을 먼저 적용
  const out = next(action);

  // 2) 스냅샷 푸시: 추적 대상 액션일 때만
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

  // 3) Undo/Redo 동작: 스냅샷을 읽어 각 슬라이스에 일괄 적용
  if (action.type === undo.type || action.type === redo.type) {
    const st = store.getState();
    const snap = selectCurrentSnapshot(st);

    if (snap) {
      isRestoring = true;
      try {
        store.dispatch(replaceVector(snap.vector));
        store.dispatch(replaceText(snap.text));
        store.dispatch(replaceImage(snap.image));
        store.dispatch(replaceSelection(snap.selection));
      } finally {
        isRestoring = false;
      }
    }

    // 비트맵 히스토리도 동일 타이밍에 되감기
    const bmp = bitmapHistory(10);
    if (action.type === undo.type) bmp.undo();
    if (action.type === redo.type) bmp.redo();
  }

  return out;
};

export { historyOrchestrator };
