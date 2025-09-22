/**
 * @file drawSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { TOOL } from '../../constant/tool';
import { setShape } from './shapeSlice';

/**
 * @description 초기 상태 값
 */
const initialState = {
  activeTool: TOOL.INITIAL_TOOL,
};

/**
 * @description 도구 상태과리 slice
 */
const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action) {
      const selectedTool = action.payload;
      const isExists = TOOL.ALLOWED_TOOL.some(
        (tool) =>
          tool.value === selectedTool.value && tool.type === selectedTool.type
      );
      if (isExists) {
        state.activeTool = selectedTool;
      } else {
        console.error('허용하지 않는 타입입니다.');
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setShape, (state) => {
      state.activeShape = TOOL.INITIAL_TOOL;
    });
  },
});

export const { setTool } = toolSlice.actions;
export const selectActiveTool = (state) => state.tool.activeTool;
export default toolSlice.reducer;
