/**
 * @file modeSlice.js
 * @author YJH
 * @description 그리기 모드 상태관리
 */
import { createSlice } from '@reduxjs/toolkit';
import { MODE } from '../../constant/mode';

/**
 * @description 초기값
 */
const initialState = { active: MODE.INITIAL_MODE };

/**
 * @description 그리기 모드 변경
 */
const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    setMode(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setMode } = modeSlice.actions;
export default modeSlice.reducer;

export const selectGlobalMode = (s) => s.mode.active;
export const isToolActive = (s) => s.mode.active === 'tool';
export const isShapeActive = (s) => s.mode.active === 'shape';
export const isTextActive = (s) => s.mode.active === 'text';
export const isSelectActive = (s) => s.mode.active === 'select';
export const isImageActive = (s) => s.mode.active === 'image';
