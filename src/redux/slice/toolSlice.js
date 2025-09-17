// src/redux/slice/toolSlice.js
import { createSlice } from '@reduxjs/toolkit';
import DefaultState from '../../constant'; // index.js에서 DRAW/STYLE/... 단일 export
const { DRAW } = DefaultState;

// Redux state 안에서 불변 상수(Object.freeze) 참조 충돌을 피하려면 얕은 복제 권장
const initialState = {
  tools: DRAW.allowed.tool.map(({ value, label }) => ({ value, label })),
  shapes: DRAW.allowed.shape.map(({ value, label }) => ({ value, label })),
};

const toolSlice = createSlice({
  name: 'toolRegistry',
  initialState,
  reducers: {},
});

export const selectAllowedTools = (st) => st.toolRegistry.tools;
export const selectAllowedShapes = (st) => st.toolRegistry.shapes;
export default toolSlice.reducer;
