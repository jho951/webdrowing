/**
 * @file drawSlice.ts
 * @author YJH
 * @description 도구 및 도형 관리 슬라이스
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Tool =
  | 'brush'
  | 'eraser'
  | 'line'
  | 'rect'
  | 'circle'
  | 'curve'
  | 'text'
  | 'image'
  | 'edit';

const toolSlice = createSlice({
  name: 'tool',
  initialState: { active: 'select' as Tool },
  reducers: {
    setDraw(state, action: PayloadAction<Tool>) {
      state.active = action.payload;
    },
  },
});
export const { setDraw } = toolSlice.actions;
export default toolSlice.reducer;
