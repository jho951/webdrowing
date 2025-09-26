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
      state.activeWidth = action.payload;
    },
  },
});

export const { setWidth } = widthSlice.actions;
export const selectActiveWidth = (state) => state.width.activeWidth;
export default widthSlice.reducer;
