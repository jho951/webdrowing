/**
 * @file drawSlice.js
 * @description 툴(드로잉 도구) 전용 슬라이스
 */
import { createSlice } from '@reduxjs/toolkit';
import DefaultState from '../../constant';

const { DRAW } = DefaultState;

const initialState = {
  activeTool: DRAW.active.value,
};

const drawSlice = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    setTool(state, action) {
      if (DRAW.allowed.tool.some((t) => t.value === action.payload)) {
        state.activeTool = action.payload;
      }
    },
    resetDrawState() {
      return { activeTool: DRAW.active.value };
    },
  },
});

export const { setTool, resetDrawState } = drawSlice.actions;
export const selectActiveTool = (st) => st.draw.activeTool;
export default drawSlice.reducer;
