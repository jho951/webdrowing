import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: '#000000',
  width: 3,
  rotate: 0,
  scale: 1.0,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelection(state, action) {
      const p = action.payload || {};
      if (p.key) state[p.key] = p.value;
      if (p.color != null) state.color = p.color;
      if (p.width != null) state.width = p.width;
      if (p.scale != null) state.scale = p.scale;
      if (p.rotate != null) state.rotate = p.rotate;
    },
    clearSelection() {
      return { ...initialState };
    },
    replace(state, action) {
      return action.payload && typeof action.payload === 'object'
        ? { ...state, ...action.payload }
        : state;
    },
  },
});

export const { setSelection, clearSelection, replace } = selectionSlice.actions;
export default selectionSlice.reducer;
