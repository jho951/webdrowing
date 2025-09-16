import { createSlice } from '@reduxjs/toolkit';
import { makeInitialViewState } from '../constants/defaultState.js';

const initialState = makeInitialViewState();

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setScale(s, a) { s.scale = a.payload; },     
    setRotate(s, a) { s.rotate = a.payload; },  

    resetView() { return makeInitialViewState(); },
  },
});

export const { setScale, setRotate, resetView } = viewSlice.actions;
export default viewSlice.reducer;
