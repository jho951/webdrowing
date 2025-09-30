/**
 * @file shapeSlice.js
 * @author YJH
 * @description 벡터 도형 상태(사각형/원/선)
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { MODE } from '../../constant/mode';
import { SHAPE } from '../../constant/shape';

const initialState = {
  mode: MODE.GLOBAL_NULL,
  value: null,
  items: [],
};

const shapeSlice = createSlice({
  name: SHAPE.SHAPE_TYPE,
  initialState,
  reducers: {
    setShape(state, action) {
      state.value = action.payload;
    },
    addShape(state, action) {
      state.items.push(action.payload);
    },
    updateShape(state, action) {
      const idx = state.items.findIndex((it) => it.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
    },
    removeShape(state, action) {
      state.items = state.items.filter((it) => it.id !== action.payload);
    },
    clearShapes(state) {
      state.items = [];
    },
    updateShapeTransform(state, action) {
      const { id, transform } = action.payload;
      const it = state.items.find((x) => x.id === id);
      if (it) it.transform = { ...(it.transform || {}), ...transform };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMode, (state, { payload }) => {
      state.mode =
        payload === SHAPE.SHAPE_TYPE ? SHAPE.SHAPE_TYPE : MODE.GLOBAL_NULL;
    });
  },
});

export const {
  setShape,
  addShape,
  updateShape,
  removeShape,
  clearShapes,
  updateShapeTransform,
} = shapeSlice.actions;

export default shapeSlice.reducer;

export const selectShapeState = (s) => s.shape;
export const selectShapeMode = (s) => s.shape.mode;
export const selectActiveShape = (s) =>
  s.shape.mode === SHAPE.SHAPE_TYPE ? s.shape.value : null;
export const selectVectorItems = (s) => s.shape.items;
