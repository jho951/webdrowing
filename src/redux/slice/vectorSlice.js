import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shapes: [],
};

const vectorSlice = createSlice({
  name: 'vector',
  initialState,
  reducers: {
    addShape(state, action) { state.shapes.push(action.payload); },
    updateShape(state, action) {
      const i = state.shapes.findIndex(s => s.id === action.payload.id);
      if (i >= 0) state.shapes[i] = action.payload;
    },
    removeShape(state, action) {
      const id = action.payload;
      state.shapes = state.shapes.filter(s => s.id !== id);
    },
    clearShapes(state) { state.shapes = []; },

    // 미들웨어에서 replaceVector(snap.vector) 호출 → 전체 교체
    replaceAll(state, action) {
      return action.payload && typeof action.payload === 'object'
        ? { ...action.payload }
        : state;
    },
  },
});

export const {
  addShape, updateShape, removeShape, clearShapes, replaceAll,
} = vectorSlice.actions;
export default vectorSlice.reducer;
