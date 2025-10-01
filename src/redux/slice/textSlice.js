/**
 * @file textSlice.js
 * @description 텍스트 상자 상태
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { MODE } from '../../constant/mode';
import { TEXT } from '../../constant/text';

const initialState = {
    mode: MODE.GLOBAL_NULL,
    boxes: [],
    activeId: null,
};

const textSlice = createSlice({
    name: 'text',
    initialState,
    reducers: {
        addTextBox(state, action) {
            state.boxes.push(action.payload);
            state.activeId = action.payload.id;
        },
        updateTextBox(state, action) {
            const idx = state.boxes.findIndex(
                (b) => b.id === action.payload.id
            );
            if (idx >= 0) state.boxes[idx] = action.payload;
        },
        removeTextBox(state, action) {
            state.boxes = state.boxes.filter((b) => b.id !== action.payload);
            if (state.activeId === action.payload) state.activeId = null;
        },
        setActiveTextBox(state, action) {
            state.activeId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setMode, (state, { payload }) => {
            state.mode =
                payload === TEXT.TEXT_TYPE ? TEXT.TEXT_TYPE : MODE.GLOBAL_NULL;
        });
    },
});

export const { addTextBox, updateTextBox, removeTextBox, setActiveTextBox } =
    textSlice.actions;

export default textSlice.reducer;

export const selectTextState = (s) => s.text;
export const selectTextMode = (s) => s.text.mode;
export const selectTextBoxes = (s) => s.text.boxes;
export const selectActiveTextId = (s) => s.text.activeId;
