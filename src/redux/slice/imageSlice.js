import { createSlice } from '@reduxjs/toolkit';

const initialState = { src: null };

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setImageSrc(state, action) {
      state.src = action.payload;
    },
  },
});

export const { setImageSrc } = imageSlice.actions;
export const selectImageSrc = (state) => state.image.src;
export default imageSlice.reducer;
