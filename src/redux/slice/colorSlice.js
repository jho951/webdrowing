/**
 * @file colorSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { COLOR } from '../../constant/color';

const initialState = {
  activeColor: COLOR.INITIAL_COLOR,
};

const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setColor(state, action) {
      state.activeColor = action.payload;
    },
  },
});

export const { setColor } = colorSlice.actions;
export const selectActiveColor = (state) => state.color.activeColor;
export default colorSlice.reducer;
