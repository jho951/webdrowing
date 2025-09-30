/**
 * @file selectSlice.js
 * @description 선택/영역(마키) 및 트랜스폼 상태
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { MODE } from '../../constant/mode';
import { SELECT } from '../../constant/select';

const initialState = {
  mode: MODE.GLOBAL_NULL,
  marquee: null,
  selectedIds: [],
  options: {
    dashed: true,
    handleSize: 8,
    showBounds: true,
  },
};

const selectSlice = createSlice({
  name: SELECT.SELECT_TYPE,
  initialState,
  reducers: {
    setMarquee(state, action) {
      state.marquee = action.payload;
    },
    setSelectedIds(state, action) {
      state.selectedIds = action.payload;
    },
    clearSelection(state) {
      state.marquee = null;
      state.selectedIds = [];
    },
    setSelectOptions(state, action) {
      state.options = { ...state.options, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setMode, (state, { payload }) => {
      state.mode =
        payload === SELECT.SELECT_TYPE ? SELECT.SELECT_TYPE : MODE.GLOBAL_NULL;
      if (state.mode === SELECT.SELECT_TYPE) state.marquee = null;
    });
  },
});

export const { setMarquee, setSelectedIds, clearSelection, setSelectOptions } =
  selectSlice.actions;

export default selectSlice.reducer;

export const selectSelectState = (s) => s.select;
export const selectSelectMode = (s) => s.select.mode;
export const selectMarquee = (s) => s.select.marquee;
export const selectSelectedIds = (s) => s.select.selectedIds;
export const selectSelectOptions = (s) => s.select.options;
