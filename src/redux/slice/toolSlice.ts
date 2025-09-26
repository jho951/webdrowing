/**
 * @file drawSlice.ts
 * @author YJH
 * @description 도구 및 도형 관리 슬라이스
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Tool = string;
const toolSlice = createSlice({
  name: 'tool',
  initialState: { active: 'brush' as Tool },
  reducers: {
    setTool(state, action: PayloadAction<Tool>) {
      state.active = action.payload;
    },
  },
});
export const { setTool } = toolSlice.actions;
export default toolSlice.reducer;
