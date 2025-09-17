import { createSlice } from '@reduxjs/toolkit';
import DefaultState from '../../constant/defaultState';

const initialState = DefaultState.makeInitialViewState();

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setScale(s, a) {
      s.scale = a.payload;
    },
    setRotate(s, a) {
      s.rotate = a.payload;
    },

    resetView() {
      return DefaultState.makeInitialViewState();
    },
  },
});

export const { setScale, setRotate, resetView } = viewSlice.actions;
export default viewSlice.reducer;
