import { createSlice } from '@reduxjs/toolkit';
import { SIZE } from '../../constant/size';

const initialState = {
  width: SIZE.width,
  height: SIZE.height,
};

const sizeSlice = createSlice({
  name: 'size',
  initialState,
  reducers: {
    setSize(state, action) {
      const { width, height } = action.payload || {};
      if (Number.isFinite(width) && width > 0) state.width = Math.floor(width);
      if (Number.isFinite(height) && height > 0)
        state.height = Math.floor(height);
    },
    resetSize() {
      return { ...initialState };
    },
  },
});

export const { setSize, resetSize } = sizeSlice.actions;
export default sizeSlice.reducer;
