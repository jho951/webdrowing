/**
 * @file shapeSlice.js
 * @author YJH
 * @description 벡터 도형 상태(사각형/원/선/텍스트 등) + 히스토리용 setShapes
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { MODE } from '../../constant/mode';
import { SHAPE } from '../../constant/shape';

const initialState = {
    mode: MODE.GLOBAL_NULL,
    value: null,
    items: [],
};

const shapeSlice = createSlice({
    name: 'shape',
    initialState,
    reducers: {
        setShape(state, { payload }) {
            state.value = String(payload);
        },
        setShapes(state, { payload }) {
            state.items = Array.isArray(payload) ? payload.slice() : [];
        },

        addShape(state, { payload }) {
            state.items.push(payload);
        },

        updateShape(state, { payload }) {
            const idx = state.items.findIndex((it) => it.id === payload?.id);
            if (idx >= 0) state.items[idx] = payload;
        },

        removeShape(state, { payload }) {
            state.items = state.items.filter((it) => it.id !== payload);
        },

        clearShapes(state) {
            state.items = [];
        },

        updateShapeTransform(state, { payload }) {
            const { id, transform } = payload || {};
            const it = state.items.find((x) => x.id === id);
            if (it)
                it.transform = {
                    ...(it.transform || {}),
                    ...(transform || {}),
                };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setMode, (state, { payload }) => {
            state.mode =
                payload === SHAPE.SHAPE_TYPE
                    ? SHAPE.SHAPE_TYPE
                    : MODE.GLOBAL_NULL;
        });
    },
});

export const {
    setShape,
    setShapes,
    addShape,
    updateShape,
    removeShape,
    clearShapes,
    updateShapeTransform,
} = shapeSlice.actions;

export default shapeSlice.reducer;

export const selectShapeState = (s) => s.shape;
export const selectShapeMode = (s) => s.shape.mode;
export const selectActiveShape = (s) => s.shape.value;
export const selectVectorItems = (s) => s.shape.items;
export const selectShapeById = (id) => (s) =>
    s.shape.items.find((it) => it.id === id) || null;
