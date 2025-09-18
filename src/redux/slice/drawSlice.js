/**
 * @file drawSlice.js
 * @description 툴(드로잉 도구) 전용 슬라이스
 */
import { createSlice } from '@reduxjs/toolkit';
import { DRAW } from '../../constant/draw';

const initialState = {
  activeTool: DRAW.active.value,
  activeShape: null,
};

const drawSlice = createSlice({
  name: 'draw',
  initialState,
  reducers: {
    setTool(state, action) {
      const value = action.payload;
      if (DRAW.allowedTool.some((t) => t.value === value)) {
        state.activeTool = value;
        state.activeShape = null;
      }
    },
    setShape(state, action) {
      const value = action.payload;
      if (DRAW.allowedShape.some((s) => s.value === value)) {
        state.activeShape = value;
        state.activeTool = null;
      }
    },
    resetDrawState() {
      return {
        activeTool: DRAW.active.value,
        activeShape: null,
      };
    },
  },
});

export const { setTool, setShape, resetDrawState } = drawSlice.actions;

export const selectActiveTool = (state) => state.draw.activeTool;
export const selectActiveShape = (state) => state.draw.activeShape;

export default drawSlice.reducer;
