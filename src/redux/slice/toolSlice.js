/**
 * @file toolSlice.js
 * @author YJH
 * @description 비트맵 도구(붓/지우개) 상태
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { TOOL } from '../../constant/tool';
import { MODE } from '../../constant/mode';

const initialState = {
  mode: TOOL.TOOL_TYPE,
  value: TOOL.INITIAL_TOOL.payload,
};

const toolSlice = createSlice({
  name: TOOL.TOOL_TYPE,
  initialState,
  reducers: {
    setTool(state, action) {
      state.value = action.payload;
    },
    resetTool(state) {
      state.value = TOOL.INITIAL_TOOL.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMode, (state, { payload }) => {
      state.mode =
        payload === TOOL.TOOL_TYPE ? TOOL.TOOL_TYPE : MODE.GLOBAL_NULL;
    });
  },
});

export const { setTool, resetTool } = toolSlice.actions;
export default toolSlice.reducer;

export const selectToolState = (s) => s.tool;
export const selectToolMode = (s) => s.tool.mode;
export const selectActiveTool = (s) =>
  s.tool.mode === TOOL.TOOL_TYPE ? s.tool.value : null;
