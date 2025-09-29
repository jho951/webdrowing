import { createSlice } from '@reduxjs/toolkit';
import { STYLE } from '../../constant/style';

const initialState = {
  color: STYLE.INITIAL_COLOR.value,
  width: STYLE.INITIAL_WIDTH.value,
};

const selectSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelection(state, action) {
      const p = action.payload || {};
      if (p.color != null) {
        state.color = STYLE.isAllowedColor(p.color)
          ? STYLE.resolveColor(p.color).value
          : state.color;
      }
      if (p.width != null) {
        state.width = STYLE.resolveWidth(p.width);
      }
    },
    resetSelection() {
      return { ...initialState };
    },
    replace(state, action) {
      return action.payload && typeof action.payload === 'object'
        ? { ...state, ...action.payload }
        : state;
    },
  },
});

export const { setSelection, resetSelection, replace } = selectSlice.actions;
export default selectSlice.reducer;
