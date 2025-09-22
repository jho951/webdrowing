/**
 * @file shapeSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { SHAPE } from '../../constant/shape';
import { setTool } from './toolSlice';

const initialState = {
  activeShape: SHAPE.INITIAL_SHAPE,
};

const shapeSlice = createSlice({
  name: 'shape',
  initialState,
  reducers: {
    setShape(state, action) {
      const selectedShape = action.payload;
      const isExists = SHAPE.ALLOWED_SHAPE.some(
        (shape) => shape.value === selectedShape.value
      );
      if (isExists) {
        state.activeShape = selectedShape;
      } else {
        console.error('허용하지 않는 타입입니다.');
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setTool, (state) => {
      state.activeShape = SHAPE.INITIAL_SHAPE;
    });
  },
});

export const { setShape } = shapeSlice.actions;
export const selectActiveShape = (state) => state.shape.activeShape;
export default shapeSlice.reducer;
