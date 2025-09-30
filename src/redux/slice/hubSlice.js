import { createSlice } from '@reduxjs/toolkit';
import { undoBitmap, redoBitmap } from './historySlice';
import { undoVector, redoVector } from './vectorSlice';

const hubSlice = createSlice({
  name: 'historyHub',
  initialState: { lastLayer: 'bitmap' },
  reducers: {
    markBitmap(state) {
      state.lastLayer = 'bitmap';
    },
    markVector(state) {
      state.lastLayer = 'vector';
    },
  },
});

export const { markBitmap, markVector } = hubSlice.actions;
export const smartUndo = () => (dispatch, getState) => {
  const last = getState().historyHub?.lastLayer || 'bitmap';
  if (last === 'vector') dispatch(undoVector());
  else dispatch(undoBitmap());
};

export const smartRedo = () => (dispatch, getState) => {
  const last = getState().historyHub?.lastLayer || 'bitmap';
  if (last === 'vector') dispatch(redoVector());
  else dispatch(redoBitmap());
};

export default hubSlice.reducer;
