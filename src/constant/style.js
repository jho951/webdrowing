/**
 * @file style.js
 * @author YJH
 * @description 색상/선두께/배율/회전을 불변 상수로 정의하고,
 *              캔버스/벡터 공통으로 쓸 수 있는 유틸을 제공합니다.
 */

import { deepFreeze } from '../util/deep-freeze';

const pct = (n) => `${Math.round(n * 100)}%`;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const mod = (n, m) => ((n % m) + m) % m;
const nearest = (n, candidates) =>
  candidates.reduce((best, cur) =>
    Math.abs(cur - n) < Math.abs(best - n) ? cur : best
  );

/* ────────────────────────────────────────────────────────── *
 * COLOR
 * ────────────────────────────────────────────────────────── */
const INITIAL_COLOR = Object.freeze({
  type: 'basic',
  value: '#000000',
  label: '검정',
});

/** 필요 시 여기만 추가하면 됩니다 */
const ALLOWED_COLOR = deepFreeze([
  INITIAL_COLOR,
  { type: 'basic', value: '#FFFFFF', label: '흰색' },
  { type: 'basic', value: '#FF0000', label: '빨강' },
  { type: 'basic', value: '#0000FF', label: '파랑' },
  { type: 'basic', value: '#00FF00', label: '초록' },
  { type: 'basic', value: '#FFFF00', label: '노랑' },
]);

const COLOR_BY_VALUE = Object.freeze(
  ALLOWED_COLOR.reduce((acc, c) => ((acc[c.value.toUpperCase()] = c), acc), {})
);
const COLOR_BY_LABEL = Object.freeze(
  ALLOWED_COLOR.reduce((acc, c) => ((acc[c.label] = c), acc), {})
);

const isAllowedColor = (valueOrLabel) => {
  if (!valueOrLabel) return false;
  const key = String(valueOrLabel).toUpperCase();
  return Boolean(COLOR_BY_VALUE[key] || COLOR_BY_LABEL[valueOrLabel]);
};

const resolveColor = (valueOrLabel) => {
  if (!valueOrLabel) return INITIAL_COLOR;
  const key = String(valueOrLabel).toUpperCase();
  return COLOR_BY_VALUE[key] || COLOR_BY_LABEL[valueOrLabel] || INITIAL_COLOR;
};

/* ────────────────────────────────────────────────────────── *
 * WIDTH (px)
 * ────────────────────────────────────────────────────────── */
const INITIAL_WIDTH = Object.freeze({ value: 3, label: '3px' });

/** 굵기는 굵은 → 가는 순으로 정렬해 둡니다(UX상 선택 시 편함) */
const ALLOWED_WIDTH = deepFreeze([
  { value: 9, label: '9px' },
  { value: 7, label: '7px' },
  { value: 5, label: '5px' },
  INITIAL_WIDTH,
  { value: 1, label: '1px' },
]);

const WIDTH_VALUES = ALLOWED_WIDTH.map((w) => w.value);

const isAllowedWidth = (n) => WIDTH_VALUES.includes(Number(n));
const nearestWidth = (n) => nearest(Number(n), WIDTH_VALUES);
const resolveWidth = (n) => (isAllowedWidth(n) ? Number(n) : nearestWidth(n));

/* ────────────────────────────────────────────────────────── *
 * SCALE (배율)
 * ──────────────────────────────────────────────────────────
 * 실사용 구간을 커버하는 단계형 배율(0.25x ~ 4x)을 기본 제공.
 * 캔버스 확대/축소, 벡터 뷰박스 스케일 등에 공용으로 쓰세요.
 */
const INITIAL_SCALE = Object.freeze({ value: 1.0, label: '100%' });

const ALLOWED_SCALE = deepFreeze([
  { value: 0.25, label: pct(0.25) },
  { value: 0.5, label: pct(0.5) },
  { value: 0.75, label: pct(0.75) },
  INITIAL_SCALE,
  { value: 1.25, label: pct(1.25) },
  { value: 1.5, label: pct(1.5) },
  { value: 2.0, label: pct(2.0) },
  { value: 3.0, label: pct(3.0) },
  { value: 4.0, label: pct(4.0) },
]);

const SCALE_VALUES = ALLOWED_SCALE.map((s) => s.value);

const isAllowedScale = (n) => SCALE_VALUES.includes(Number(n));
const nearestScale = (n) => nearest(Number(n), SCALE_VALUES);
/** 임의 배율 허용 시 안전 범위(0.1~8.0)로 클램프 후 근사값 */
const resolveScale = (n, { snap = true } = {}) => {
  const clamped = clamp(Number(n), 0.1, 8.0);
  return snap ? nearestScale(clamped) : clamped;
};

/* ────────────────────────────────────────────────────────── *
 * ROTATE (도 단위)
 * ──────────────────────────────────────────────────────────
 * 회전은 -∞~∞ 입력을 0~359로 정규화, 스냅(step=15° 기본) 제공.
 */
const INITIAL_ROTATE = Object.freeze({ value: 0, label: '0' });

const normalizeRotate = (deg) => mod(Number(deg), 360);
/** 15°, 5° 등 원하는 단위로 스냅 */
const snapRotate = (deg, step = 15) => {
  const n = normalizeRotate(deg);
  const steps = Math.round(n / step);
  return mod(steps * step, 360);
};

/**
 * @description STYLE 프리셋 & 타입 형태
 * @typedef {Object} DrawStyle
 * @property {string} color HEX 컬러 (예: '#000000')
 * @property {number} width 선두께(px)
 * @property {number} scale 배율(1.0 = 100%)
 * @property {number} rotate 회전각(0~359, deg)
 * @property {'round'|'butt'|'square'} [lineCap]
 * @property {'round'|'miter'|'bevel'} [lineJoin]
 * @property {number} [miterLimit]
 */

const DEFAULT_STYLE = Object.freeze(
  /** @type {DrawStyle} */ ({
    color: INITIAL_COLOR.value,
    width: INITIAL_WIDTH.value,
    scale: INITIAL_SCALE.value,
    rotate: INITIAL_ROTATE.value,
    lineCap: 'round',
    lineJoin: 'round',
    miterLimit: 10,
  })
);

/**
 * CanvasRenderingContext2D에 스타일 적용
 * @description 적용 유틸 (Canvas 2D / 벡터 공용)
 * @param {CanvasRenderingContext2D} ctx
 * @param {Partial<DrawStyle>} style
 */
const applyCanvasStyle = (ctx, style = {}) => {
  const merged = { ...DEFAULT_STYLE, ...style };
  ctx.strokeStyle = merged.color;
  ctx.fillStyle = merged.color;
  ctx.lineWidth = resolveWidth(merged.width);
  if (merged.lineCap) ctx.lineCap = merged.lineCap;
  if (merged.lineJoin) ctx.lineJoin = merged.lineJoin;
  if (merged.miterLimit != null) ctx.miterLimit = merged.miterLimit;
};

/**
 * 벡터(예: SVG) 속성에 매핑하기 위한 변환
 * @param {Partial<DrawStyle>} style
 * @returns {{ stroke:string, strokeWidth:number, transform:string, strokeLinecap:string, strokeLinejoin:string }}
 */
const toVectorAttrs = (style = {}) => {
  const merged = { ...DEFAULT_STYLE, ...style };
  const rotate = normalizeRotate(merged.rotate);
  return {
    stroke: merged.color,
    strokeWidth: resolveWidth(merged.width),
    transform: `scale(${merged.scale}) rotate(${rotate})`,
    strokeLinecap: merged.lineCap,
    strokeLinejoin: merged.lineJoin,
  };
};

/* ────────────────────────────────────────────────────────── *
 * 빠른 프리셋 (툴바용)
 * ────────────────────────────────────────────────────────── */
const STYLE_PRESETS = deepFreeze({
  thin: { ...DEFAULT_STYLE, width: 1 },
  normal: { ...DEFAULT_STYLE, width: 3 },
  thick: { ...DEFAULT_STYLE, width: 7 },
  black: { ...DEFAULT_STYLE, color: '#000000' },
  red: { ...DEFAULT_STYLE, color: '#FF0000' },
  blue: { ...DEFAULT_STYLE, color: '#0000FF' },
  zoomIn: { ...DEFAULT_STYLE, scale: 1.5 },
  zoomOut: { ...DEFAULT_STYLE, scale: 0.75 },
});

/* ────────────────────────────────────────────────────────── *
 * 모듈 기본 export (선택)
 * ────────────────────────────────────────────────────────── */
export const STYLE = {
  INITIAL_COLOR,
  ALLOWED_COLOR,
  isAllowedColor,
  resolveColor,
  INITIAL_WIDTH,
  ALLOWED_WIDTH,
  isAllowedWidth,
  nearestWidth,
  resolveWidth,
  INITIAL_SCALE,
  ALLOWED_SCALE,
  isAllowedScale,
  nearestScale,
  resolveScale,
  INITIAL_ROTATE,
  normalizeRotate,
  snapRotate,
  DEFAULT_STYLE,
  applyCanvasStyle,
  toVectorAttrs,
  STYLE_PRESETS,
};
