/**
 * @file imageSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { images: [] };

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    addImage(state, action) {
      state.images.push(action.payload);
    },
    updateImage(state, action) {
      const idx = state.images.findIndex((img) => img.id === action.payload.id);
      if (idx >= 0) state.images[idx] = action.payload;
    },
    removeImage(state, action) {
      const id = action.payload;
      state.images = state.images.filter((img) => img.id !== id);
    },
    replaceAll(state, action) {
      return action.payload && typeof action.payload === 'object'
        ? { ...action.payload }
        : state;
    },
    clear(state) {
      state.images = [];
    },
  },
});

export const { addImage, updateImage, removeImage, replaceAll, clear } =
  imageSlice.actions;
export default imageSlice.reducer;
