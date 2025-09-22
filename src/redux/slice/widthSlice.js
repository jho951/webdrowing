/**
 * @file widthSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { WIDTH } from '../../constant/width';

/**
 * @description 초기 상태 값
 */
const initialState = {
  activeWidth: WIDTH.INITIAL_WIDTH,
};

/**
 * @description 허용 크기
 */
const widthSlice = createSlice({
  name: 'width',
  initialState,
  reducers: {
    setWidth(state, action) {
      const selectedWidth = action.payload;
      const isExists = WIDTH.ALLOWED_WIDTH.some(
        (width) => width.value === selectedWidth.value
      );
      if (isExists) {
        state.activeWidth = selectedWidth;
      } else {
        console.error('허용하지 않는 타입입니다.');
      }
    },
  },
});

export const { setWidth } = widthSlice.actions;
export const selectActiveWidth = (state) => state.width.activeWidth;
export default widthSlice.reducer;
