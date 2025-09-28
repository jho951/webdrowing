import { TOOL } from "./tool";

export type ColorOption = { type: 'basic'; value: string; label: string };
export type WidthOption = { value: number; label: string };


//
// COLOR
//
export const COLOR = Object.freeze({
  INITIAL_COLOR: Object.freeze({ type: 'basic', value: '#000000', label: '검정' } as ColorOption),
  ALLOWED_COLOR: Object.freeze([
    { type: 'basic', value: '#000000', label: '검정' },
    { type: 'basic', value: '#FFFFFF', label: '흰색' },
    { type: 'basic', value: '#FF0000', label: '빨강' },
    { type: 'basic', value: '#0000FF', label: '파랑' },
    { type: 'basic', value: '#00FF00', label: '초록' },
    { type: 'basic', value: '#FFFF00', label: '노랑' },
  ] as ColorOption[]),
});

//
// WIDTH
//
export const WIDTH = Object.freeze({
  INITIAL_WIDTH: Object.freeze({ value: 3, label: '3px' } as WidthOption),
  ALLOWED_WIDTH: Object.freeze([
    { value: 9, label: '9px' },
    { value: 7, label: '7px' },
    { value: 5, label: '5px' },
    { value: 3, label: '3px' },
    { value: 1, label: '1px' },
  ] as WidthOption[]),
});
//
// SIZE (대시보드 초기 크기)
//
export const SIZE = Object.freeze({ width: 1000, height: 700 });

//
// VIEW (확대/회전)
//
export const VIEW = Object.freeze({ SCALE: 1.0, ROTATE: 0 });

//
// HISTORY (히스토리 예산)
//
export const HISTORY = Object.freeze({ MODE: 'float32', BUDGET_MB: 16, MAX_COUNT: 500 });

//
// IMAGE (초기 이미지 상태)
//
export const IMAGE = Object.freeze({
  INITIAL_IMAGE: Object.freeze({ src: null as string | null, alt: '', width: 0, height: 0 }),
});

//
// 편의 합본 (툴바 등에서 바로 쓰기)
//
export const MENU = Object.freeze({
  TOOL: TOOL.ALLOWED_TOOL,
  COLOR: COLOR.ALLOWED_COLOR,
  WIDTH: WIDTH.ALLOWED_WIDTH,
});
