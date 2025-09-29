import { createSlice } from '@reduxjs/toolkit';
import { bitmapHistory } from '../../util/bitmap-history';

const initialState = {
  canUndo: false,
  canRedo: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    updateHistoryState(state) {
      const h = bitmapHistory();
      state.canUndo = h.canUndo();
      state.canRedo = h.canRedo();
    },
    resetHistory() {
      return { ...initialState };
    },
  },
});

export const { updateHistoryState, resetHistory } = historySlice.actions;
export default historySlice.reducer;

/* ────────────────
 * Thunks
 * ──────────────── */

// ✅ 비트맵 현재 상태를 스냅샷으로 저장
export const pushBitmapSnapshot = () => async (dispatch) => {
  await bitmapHistory().snapshot();
  dispatch(updateHistoryState());
};

// ✅ Undo
export const undoBitmap = () => (dispatch) => {
  bitmapHistory().undo();
  dispatch(updateHistoryState());
};

// ✅ Redo
export const redoBitmap = () => (dispatch) => {
  bitmapHistory().redo();
  dispatch(updateHistoryState());
};
