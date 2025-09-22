/**
 * @file imageSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { IMAGE } from '../../constant/image';

const initialState = { activeShape: IMAGE.INITIAL_IMAGE };

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImageSrc(state, action) {
      const selectedImage = action.payload;
      state.activeShape = selectedImage;
    },
  },
});

export const { setImageSrc } = imageSlice.actions;
export const selectActiveImage = (state) => state.image.activeImage;
export default imageSlice.reducer;
