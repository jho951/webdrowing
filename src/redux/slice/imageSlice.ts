/**
 * @file imageSlice.js
 * @author YJH
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ImageModel = {
  id: import('crypto').UUID;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
};

type ImageState = { images: ImageModel[] };
const initialState: ImageState = { images: [] };

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    addImage(state, action: PayloadAction<ImageModel>) {
      state.images.push(action.payload);
    },
    updateImage(state, action: PayloadAction<ImageModel>) {
      const item = state.images.findIndex(
        (image) => image.id === action.payload.id
      );
      if (item >= 0) {
        state.images[item] = action.payload;
      }
    },
    removeImage(state, action: PayloadAction<string>) {
      state.images = state.images.filter(
        (image) => image.id === action.payload
      );
    },
    replaceAll(state, action: PayloadAction<ImageState>) {
      return action.payload;
    },
    clear(state) {
      state.images = [];
    },
  },
});
export const { addImage, updateImage, removeImage, replaceAll, clear } =
  imageSlice.actions;
export default imageSlice.reducer;
