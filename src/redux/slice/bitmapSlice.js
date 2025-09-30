/**
 * @file bitmapSlice.js
 * @author YJH
 * @description
 * - 비트맵 캔버스 상태를 스냅샷으로 저장하고 관리
 * - redo / undo용 ImageData 구현
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    snapshot: null,
};

const bitmapSlice = createSlice({
    name: 'bitmap',
    initialState,
    reducers: {
        commitBitmap(state, { payload }) {
            state.snapshot = payload.snapshot;
        },
    },
});

export const { commitBitmap } = bitmapSlice.actions;
export default bitmapSlice.reducer;
