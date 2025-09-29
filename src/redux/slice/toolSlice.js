/**
 * @file toolSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';

/**
 * @description 상태만 관리
 */
const initialState = { active: 'brush' };

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setTool } = toolSlice.actions;
export default toolSlice.reducer;
