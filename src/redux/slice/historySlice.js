import { createSlice } from '@reduxjs/toolkit';
import { bitmapHistory } from '../../util/get-bitmap-history';
import { markBitmap } from './hubSlice';

const initialState = { canUndo: false, canRedo: false };

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

const pushBitmapSnapshot = () => async (dispatch) => {
  await bitmapHistory().snapshot();
  dispatch(historySlice.actions.updateHistoryState());
  dispatch(markBitmap());
};

const undoBitmap = () => (dispatch) => {
  bitmapHistory().undo();
  dispatch(historySlice.actions.updateHistoryState());
  dispatch(markBitmap());
};

const redoBitmap = () => (dispatch) => {
  bitmapHistory().redo();
  dispatch(historySlice.actions.updateHistoryState());
  dispatch(markBitmap());
};

export { pushBitmapSnapshot, undoBitmap, redoBitmap };
export const { updateHistoryState, resetHistory } = historySlice.actions;
export default historySlice.reducer;
