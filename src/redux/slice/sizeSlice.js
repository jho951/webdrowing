/**
 * @file sizeSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';
import { SIZE } from '../../constant/size';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const normAngle = (deg) => ((Number(deg) % 360) + 360) % 360;

const initialState = {
    width: SIZE?.width ?? 800,
    height: SIZE?.height ?? 600,
    zoom: typeof SIZE?.zoom === 'number' ? SIZE.zoom : 1, // 추가
    rotation:
        typeof SIZE?.rotation === 'number' // 추가
            ? normAngle(SIZE.rotation)
            : 0,
};

const sizeSlice = createSlice({
    name: 'size',
    initialState,
    reducers: {
        setSize(state, action) {
            const { width, height } = action.payload || {};
            if (Number.isFinite(width) && width > 0)
                state.width = Math.floor(width);
            if (Number.isFinite(height) && height > 0)
                state.height = Math.floor(height);
        },
        resetSize() {
            return { ...initialState };
        },

        // ── 확대/축소 ─────────────────────────────────────
        setZoom(state, { payload }) {
            const v = Number(payload);
            if (Number.isFinite(v)) state.zoom = clamp(v, 0.1, 8); // 범위 예시: 0.1x~8x
        },
        zoomBy(state, { payload }) {
            const delta = Number(payload) || 0;
            state.zoom = clamp((state.zoom || 1) + delta, 0.1, 8);
        },

        // ── 회전 ─────────────────────────────────────────
        setRotation(state, { payload }) {
            const v = Number(payload);
            if (Number.isFinite(v)) state.rotation = normAngle(v); // 0~359로 정규화
        },
        rotateBy(state, { payload }) {
            const delta = Number(payload) || 0;
            state.rotation = normAngle((state.rotation || 0) + delta);
        },
    },
});

export const { setSize, resetSize, setZoom, zoomBy, setRotation, rotateBy } =
    sizeSlice.actions;

export default sizeSlice.reducer;

export const selectCanvasSize = (s) => ({
    width: s.size.width,
    height: s.size.height,
});
export const selectZoom = (s) => s.size.zoom;
export const selectRotation = (s) => s.size.rotation;
