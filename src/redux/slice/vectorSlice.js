import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedId: null,
};

const vectorSlice = createSlice({
  name: 'vector',
  initialState,
  reducers: {
    addShape(state, action) {
      state.items.push(action.payload);
      state.selectedId = action.payload.id;
    },
    updateShape(state, action) {
      const { id, patch } = action.payload;
      const it = state.items.find((s) => s.id === id);
      if (it) Object.assign(it, patch);
    },
    removeShape(state, action) {
      const id = action.payload;
      state.items = state.items.filter((s) => s.id !== id);
      if (state.selectedId === id) state.selectedId = null;
    },
    selectShape(state, action) {
      state.selectedId = action.payload;
    },
    clearShapes(state) {
      state.items = [];
      state.selectedId = null;
    },
  },
});

export const { addShape, updateShape, removeShape, selectShape, clearShapes } =
  vectorSlice.actions;
export default vectorSlice.reducer;

export const selectVectorState = (st) => st.vector ?? initialState;
export const selectVectorShapes = (st) => st.vector?.items ?? [];
export const selectVectorSelectedId = (st) => st.vector?.selectedId ?? null;
export const selectVectorSelectedShape = (st) => {
  const items = st.vector?.items ?? [];
  const id = st.vector?.selectedId ?? null;
  return id ? (items.find((s) => s.id === id) ?? null) : null;
};
