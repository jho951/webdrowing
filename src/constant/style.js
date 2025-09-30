/**
 * @file style.js
 * @author YJH
 * @description 색상/선두께/배율/회전을 불변 상수로 정의하고,
 *              캔버스/벡터 공통으로 쓸 수 있는 유틸을 제공합니다.
 */

import { deepFreeze } from '../util/deep-freeze';

const STYLE_TYPE = 'style';

/**
 * @description 색상
 */
const INITIAL_COLOR = deepFreeze({
  type: 'basic',
  value: '#000000',
  label: '검정',
});

const ALLOWED_COLOR = deepFreeze([
  INITIAL_COLOR,
  { type: 'basic', value: '#FFFFFF', label: '흰색' },
  { type: 'basic', value: '#FF0000', label: '빨강' },
  { type: 'basic', value: '#0000FF', label: '파랑' },
  { type: 'basic', value: '#00FF00', label: '초록' },
  { type: 'basic', value: '#FFFF00', label: '노랑' },
]);

/**
 * @description 굵기
 */
const INITIAL_WIDTH = Object.freeze({ value: 3, label: '3px' });

const ALLOWED_WIDTH = deepFreeze([
  { value: 9, label: '9px' },
  { value: 7, label: '7px' },
  { value: 5, label: '5px' },
  INITIAL_WIDTH,
  { value: 1, label: '1px' },
]);

/**
 * @description 배율
 */
const pct = (v) => `${Math.round(v * 100)}%`;

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

/**
 * @description 회전 스텝
 */
const INITIAL_ROTATE = Object.freeze({ value: 0, label: '0°' });
const ALLOWED_ROTATE = deepFreeze([
  INITIAL_ROTATE,
  { value: 15, label: '15°' },
  { value: 30, label: '30°' },
  { value: 45, label: '45°' },
  { value: 90, label: '90°' },
]);

export const STYLE = {
  STYLE_TYPE,
  INITIAL_COLOR,
  ALLOWED_COLOR,
  INITIAL_WIDTH,
  ALLOWED_WIDTH,
  INITIAL_SCALE,
  ALLOWED_SCALE,
  INITIAL_ROTATE,
  ALLOWED_ROTATE,
};
