/**
 * @file selectSlice.ts
 * @author YJH
 * @description 선택 영역 상태 관리
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const selectSlice = createSlice({
  name: 'select',
  initialState: { rect: null as Rect | null },
  reducers: {
    setSelection(state, action: PayloadAction<Rect>) {
      state.rect = action.payload;
    },
    clearSelection(state) {
      state.rect = null;
    },
    replace(state, action: PayloadAction<{ rect: Rect | null }>) {
      return action.payload;
    },
  },
});
export const { setSelection, clearSelection, replace } = selectSlice.actions;
export default selectSlice.reducer;
