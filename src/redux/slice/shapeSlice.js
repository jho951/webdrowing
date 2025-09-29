import { createSlice } from '@reduxjs/toolkit';

const initialState = { active: 'line' };

const shapeSlice = createSlice({
  name: 'shape',
  initialState,
  reducers: {
    setShape(state, action) {
      state.active = String(action.payload);
    },
  },
});

export const { setShape } = shapeSlice.actions;
export default shapeSlice.reducer;
