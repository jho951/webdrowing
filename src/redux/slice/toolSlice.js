/**
 * @file drawSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { TOOL } from '../../constant/tool';
import { setShape } from './shapeSlice';

const initialState = {
  activeTool: TOOL.INITIAL_TOOL,
};

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action) {
      const isExists = TOOL.ALLOWED_TOOL.some(
        (tool) =>
          tool.value === action.payload.value &&
          tool.type === action.payload.type
      );
      if (isExists) {
        state.activeTool = action.payload;
      } else {
        console.error('허용하지 않는 타입입니다.');
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setShape, (state) => {
      state.activeTool = {
        type: 'tool',
        value: null,
        label: '',
        pointer: '',
      };
    });
  },
});

export const { setTool } = toolSlice.actions;
export const selectActiveTool = (state) => state.tool.activeTool;
export default toolSlice.reducer;
