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

// ✅ thunk
export const pushSnapshot = () => async (dispatch) => {
  await bitmapHistory().snapshot();
  dispatch(updateHistoryState());
};

export const undoBitmap = () => (dispatch) => {
  bitmapHistory().undo();
  dispatch(updateHistoryState());
};

export const redoBitmap = () => (dispatch) => {
  bitmapHistory().redo();
  dispatch(updateHistoryState());
};
