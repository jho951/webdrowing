/**
 * @file styleSlice.js
 * @description 선 색상/두께 전용 슬라이스
 */
import { createSlice } from '@reduxjs/toolkit';
import { STYLE } from '../../constant/style';

const initialState = {
  color: STYLE.activeColor.value,
  width: STYLE.activeWidth.value,
};

const styleSlice = createSlice({
  name: 'style',
  initialState,
  reducers: {
    setColor(state, action) {
      if (STYLE.allowedColor.some((c) => c.value === action.payload)) {
        state.color = action.payload;
      }
    },
    setWidth(state, action) {
      if (STYLE.allowedWidth.some((w) => w.value === Number(action.payload))) {
        state.width = Number(action.payload);
      }
    },
    setStyle(state, action) {
      const next = action.payload || {};
      if (
        typeof next.color !== 'undefined' &&
        STYLE.allowedColor.some((c) => c.value === next.color)
      ) {
        state.color = next.color;
      }
      if (typeof next.width !== 'undefined') {
        const w = Number(next.width);
        if (STYLE.allowedWidth.some((x) => x.value === w)) state.width = w;
      }
    },
    resetStyleState() {
      return {
        color: STYLE.activeColor.value,
        width: STYLE.activeWidth.value,
      };
    },
  },
});

export const { setColor, setWidth, setStyle, resetStyleState } =
  styleSlice.actions;
export const selectStyle = (st) => st.style;
export const selectColor = (st) => st.style.color;
export const selectWidth = (st) => st.style.width;
export default styleSlice.reducer;
