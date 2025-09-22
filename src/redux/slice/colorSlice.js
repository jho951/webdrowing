/**
 * @file colorSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { COLOR } from '../../constant/color';

/**
 * @description 초기 상태 값
 */
const initialState = {
  activeColor: COLOR.INITIAL_COLOR,
};

/**
 * @description 허용 색상
 */
const colorSlice = createSlice({
  name: 'color',
  initialState,
  reducers: {
    setColor(state, action) {
      const selectedColor = action.payload;
      const isExists = COLOR.ALLOWED_COLOR.some(
        (color) => color.value === selectedColor.value
      );
      if (isExists) {
        state.activeColor = selectedColor;
      } else {
        console.error('허용하지 않는 타입입니다.');
      }
    },
  },
});

export const { setColor } = colorSlice.actions;
export const selectActiveColor = (state) => state.color.activeColor;
export default colorSlice.reducer;
