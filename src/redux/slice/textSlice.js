/**
 * @file textSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = { texts: [] };

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    addText(state, action) {
      state.texts.push(action.payload);
    },
    updateText(state, action) {
      const idx = state.texts.findIndex((t) => t.id === action.payload.id);
      if (idx >= 0) state.texts[idx] = action.payload;
    },
    removeText(state, action) {
      const id = action.payload;
      state.texts = state.texts.filter((t) => t.id !== id);
    },
    replaceAll(state, action) {
      return action.payload && typeof action.payload === 'object'
        ? { ...action.payload }
        : state;
    },
    clear(state) {
      state.texts = [];
    },
  },
});

export const { addText, updateText, removeText, replaceAll, clear } =
  textSlice.actions;
export default textSlice.reducer;
