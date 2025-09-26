/**
 * @file textSlice.js
 * @author YJH
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TextModel = {
  id: import('crypto').UUID;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
  align?: CanvasTextAlign;
};

type TextState = { texts: TextModel[] };
const initialState: TextState = { texts: [] };

const textSlice = createSlice({
  name: 'text',
  initialState,
  reducers: {
    addText(state, action: PayloadAction<TextModel>) {
      state.texts.push(action.payload);
    },
    updateText(state, action: PayloadAction<TextModel>) {
      const item = state.texts.findIndex(
        (text) => text.id === action.payload.id
      );
      if (item >= 0) {
        state.texts[item] = action.payload;
      }
    },
    removeText(state, action: PayloadAction<string>) {
      state.texts = state.texts.filter((text) => text.id === action.payload);
    },
    replaceAll(state, action: PayloadAction<TextState>) {
      return action.payload;
    },
    clear(state) {
      state.texts = [];
    },
  },
});
export const { addText, updateText, removeText, replaceAll, clear } =
  textSlice.actions;
export default textSlice.reducer;
