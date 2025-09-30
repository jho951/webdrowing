/**
 * @file styleSlice.js
 * @description 모드별 스타일/옵션(색, 굵기, 텍스트/이미지 프리셋, 선택 스냅 등)
 */
import { createSlice } from '@reduxjs/toolkit';
import { setMode } from './modeSlice';
import { TOOL } from '../../constant/tool';
import { SHAPE } from '../../constant/shape';
import { TEXT } from '../../constant/text';
import { IMAGE } from '../../constant/image';
import { SELECT } from '../../constant/select';
import { STYLE } from '../../constant/style';

const initialState = {
  tool: {
    stroke: {
      color: STYLE.INITIAL_COLOR.value,
      width: STYLE.INITIAL_WIDTH.value,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [],
    },
  },
  shape: {
    stroke: {
      color: STYLE.INITIAL_COLOR.value,
      width: STYLE.INITIAL_WIDTH.value,
      dash: [],
    },
    fill: { color: '#ffffff', opacity: 0 },
  },
  text: {
    color: STYLE.INITIAL_COLOR.value,
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5,
    letterSpacing: 0,
    align: 'left',
    underline: false,
    italic: false,
  },
  image: { opacity: 1, fit: 'contain', lockAspect: true },
  select: {
    overlay: { dashed: true, handleSize: 8 },
    transform: { rotateStep: 5, scaleStep: 0.1 },
  },
};

const styleSlice = createSlice({
  name: STYLE.STYLE_TYPE,
  initialState,
  reducers: {
    setStrokeColor(state, action) {
      const { mode, color } = action.payload;
      if (mode === TOOL.TOOL_TYPE) state.tool.stroke.color = color;
      if (mode === SHAPE.SHAPE_TYPE) state.shape.stroke.color = color;
      if (mode === TEXT.TEXT_TYPE) state.text.color = color;
    },
    setStrokeWidth(state, action) {
      const { mode, width } = action.payload;
      if (mode === TOOL.TOOL_TYPE) state.tool.stroke.width = width;
      if (mode === SHAPE.SHAPE_TYPE) state.shape.stroke.width = width;
    },
    setStrokeDash(state, action) {
      const { mode, dash } = action.payload;
      if (mode === TOOL.TOOL_TYPE) state.tool.stroke.dash = dash;
      if (mode === SHAPE.SHAPE_TYPE) state.shape.stroke.dash = dash;
    },
    setFillColor(state, action) {
      state.shape.fill.color = action.payload.color;
    },
    setFillOpacity(state, action) {
      state.shape.fill.opacity = action.payload.opacity;
    },
    setTextPreset(state, action) {
      state.text = { ...state.text, ...action.payload };
    },
    setImagePreset(state, action) {
      state.image = { ...state.image, ...action.payload };
    },
    setSelectPreset(state, action) {
      state.select = {
        overlay: { ...state.select.overlay, ...(action.payload.overlay || {}) },
        transform: {
          ...state.select.transform,
          ...(action.payload.transform || {}),
        },
      };
    },
    hydrateFromCatalog(state, action) {
      const { mode, defaults } = action.payload;
      if (mode === TOOL.TOOL_TYPE) state.tool = { ...state.tool, ...defaults };
      if (mode === SHAPE.SHAPE_TYPE)
        state.shape = { ...state.shape, ...defaults };
      if (mode === TEXT.TEXT_TYPE) state.text = { ...state.text, ...defaults };
      if (mode === IMAGE.IMAGE_TYPE)
        state.image = { ...state.image, ...defaults };
      if (mode === SELECT.SELECT_TYPE)
        state.select = { ...state.select, ...defaults };
    },
  },
  extraReducers: (b) => {
    b.addCase(setMode, (_s, _a) => {});
  },
});

export const {
  setStrokeColor,
  setStrokeWidth,
  setStrokeDash,
  setFillColor,
  setFillOpacity,
  setTextPreset,
  setImagePreset,
  setSelectPreset,
  hydrateFromCatalog,
} = styleSlice.actions;

export default styleSlice.reducer;

export const selectStyleState = (s) => s.style;
export const selectEffectiveStyle = (s) => {
  const mode = s.mode.active;
  if (mode === 'tool') return s.style.tool;
  if (mode === 'shape') return s.style.shape;
  if (mode === 'text') return s.style.text;
  if (mode === 'image') return s.style.image;
  if (mode === 'select') return s.style.select;
  return null;
};
