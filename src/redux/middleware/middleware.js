import {
  undoBitmap,
  redoBitmap,
  pushBitmapSnapshot,
} from '../slice/historySlice';

const TRACKED_TYPES = new Set([
  'vector/addShape',
  'selection/setSelection',
  'selection/resetSelection',
]);

let isRestoring = false;

const historyOrchestrator = (store) => (next) => (action) => {
  if (isRestoring) return next(action);
  const out = next(action);
  if (TRACKED_TYPES.has(action.type)) {
    store.dispatch(pushBitmapSnapshot());
  }
  if (action.type === 'history/undo') {
    store.dispatch(undoBitmap());
  } else if (action.type === 'history/redo') {
    store.dispatch(redoBitmap());
  }

  return out;
};

export { historyOrchestrator };
