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
    mode: MODE.GLOBAL_NULL, // 현재 글로벌 모드가 shape인지 여부 표시용
    value: null, // 활성 도형 키('rect'|'line'|'circle'|'curve'...)
    items: [], // 벡터 도형 배열
};

const shapeSlice = createSlice({
    name: 'shape',
    initialState,
    reducers: {
        /** 활성 도형 선택 (상수에 없는 키는 무시) */
        setShape(state, { payload }) {
            const key = String(payload);
            const table = SHAPE?.SHAPES_VALUE;
            if (table && !table[key]) return; // 정의되지 않은 값이면 무시
            state.value = key;
        },

        /** ✅ 히스토리/로딩용: 목록을 통째로 교체 */
        setShapes(state, { payload }) {
            state.items = Array.isArray(payload) ? payload.slice() : [];
        },

        /** 도형 추가 */
        addShape(state, { payload }) {
            state.items.push(payload);
        },

        /** 도형 전체 업데이트(동일 id 덮어쓰기) */
        updateShape(state, { payload }) {
            const idx = state.items.findIndex((it) => it.id === payload?.id);
            if (idx >= 0) state.items[idx] = payload;
        },

        /** 도형 삭제 */
        removeShape(state, { payload }) {
            state.items = state.items.filter((it) => it.id !== payload);
        },

        /** 전체 초기화 */
        clearShapes(state) {
            state.items = [];
        },

        /** 부분 변형(트랜스폼만 패치) */
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

// ─────────── Selectors ───────────
export const selectShapeState = (s) => s.shape;
export const selectShapeMode = (s) => s.shape.mode;
export const selectActiveShape = (s) => s.shape.value;
export const selectVectorItems = (s) => s.shape.items;
export const selectShapeById = (id) => (s) =>
    s.shape.items.find((it) => it.id === id) || null;
