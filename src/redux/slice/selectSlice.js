import { createSlice } from '@reduxjs/toolkit';
import { COLOR, WIDTH } from '@/constant';

const initialState = {
  color: COLOR.INITIAL_COLOR.value,
  width: WIDTH.INITIAL_WIDTH.value,
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
