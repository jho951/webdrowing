/**
 * @file shapeSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';

/**
 * @description 상태만 관리
 */
const initialState = { active: 'line' };

const shpeSlice = createSlice({
  name: 'shape',
  initialState,
  reducers: {
    setShape(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setShape } = shpeSlice.actions;
export default shpeSlice.reducer;
