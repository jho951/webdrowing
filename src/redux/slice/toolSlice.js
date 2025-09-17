/**
 * @file toolSlice.js
 * @description Tool 상태 슬라이스. defaultState의 단일 export(DefaultState)를 기반으로 구성하며,
 *              이 모듈 또한 단일 export(default)로 actions/selectors/reducer를 묶어 제공합니다.
 */

import { createSlice } from '@reduxjs/toolkit';
import DefaultState from '../../constant/defaultState';

const { DRAW_DEFAULT, makeInitialToolState } = DefaultState;

// 초기 상태
const initialState = makeInitialToolState();

// 슬라이스
const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action) {
      const v = action.payload;
      if (DRAW_DEFAULT.TOOL.ALLOWED.includes(v)) state.activeTool = v;
    },
    setColor(state, action) {
      state.style.color = action.payload;
    },
    setWidth(state, action) {
      state.style.width = action.payload;
    },
    setStyle(state, action) {
      Object.assign(state.style, action.payload || {});
    },
    setCoordMode(state, action) {
      state.coordMode = action.payload;
    },
    resetToolState() {
      return makeInitialToolState();
    },
  },
});

// 액션
const { setTool, setColor, setWidth, setStyle, setCoordMode, resetToolState } =
  toolSlice.actions;

// 셀렉터
const selectActiveTool = (st) => st.tool.activeTool;
const selectToolStyle = (st) => st.tool.style;

// 리듀서
const reducer = toolSlice.reducer;

/**
 * 단일 default export:
 * - actions: 액션 크리에이터 묶음
 * - selectors: 셀렉터 묶음
 * - reducer: 리듀서
 * - slice: createSlice 결과(필요 시 사용)
 */
const ToolStore = Object.freeze({
  actions: {
    setTool,
    setColor,
    setWidth,
    setStyle,
    setCoordMode,
    resetToolState,
  },
  selectors: { selectActiveTool, selectToolStyle },
  reducer,
  slice: toolSlice,
});

export default ToolStore;
