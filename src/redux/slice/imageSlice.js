/**
 * @file imageSlice.js
 * @description 이미지 배치/편집 상태
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { MODE } from '../../constant/mode';
import { IMAGE } from '../../constant/image';

const initialState = {
    mode: MODE.GLOBAL_NULL,
    items: [],
    activeId: null,
};

const imageSlice = createSlice({
    name: IMAGE.IMAGE_TYPE,
    initialState,
    reducers: {
        placeImage(state, action) {
            state.items.push(action.payload);
            state.activeId = action.payload.id;
        },
        updateImage(state, action) {
            const idx = state.items.findIndex(
                (it) => it.id === action.payload.id
            );
            if (idx >= 0) state.items[idx] = action.payload;
        },
        removeImage(state, action) {
            state.items = state.items.filter((it) => it.id !== action.payload);
            if (state.activeId === action.payload) state.activeId = null;
        },
        setActiveImage(state, action) {
            state.activeId = action.payload;
        },
        updateImageTransform(state, action) {
            const { id, transform } = action.payload;
            const it = state.items.find((x) => x.id === id);
            if (it) it.transform = { ...(it.transform || {}), ...transform };
        },
        clearImages(state) {
            state.items = [];
            state.activeId = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setMode, (state, { payload }) => {
            state.mode =
                payload === IMAGE.IMAGE_TYPE
                    ? IMAGE.IMAGE_TYPE
                    : MODE.GLOBAL_NULL;
        });
    },
});

export const {
    placeImage,
    updateImage,
    removeImage,
    setActiveImage,
    updateImageTransform,
    clearImages,
} = imageSlice.actions;

export default imageSlice.reducer;

export const selectImageState = (s) => s.image;
export const selectImageMode = (s) => s.image.mode;
export const selectImages = (s) => s.image.items;
export const selectActiveImageId = (s) => s.image.activeId;
