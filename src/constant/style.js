/**
 * @file style.js
 * @author YJH
 * @description 색상/선두께/배율/회전을 불변 상수로 정의하고,
 */

import { deepFreeze } from '../util/deep-freeze';

const STYLE_TYPE = 'style';

/**
 * @description 색상
 */
const INITIAL_COLOR = deepFreeze({
  type: 'color',
  value: '#000000',
  label: '검정',
  icon: 'black',
});

const ALLOWED_COLOR = deepFreeze([
  INITIAL_COLOR,
  { mode: 'color', value: '#FFFFFF', label: '흰색', icon: 'white' },
  { mode: 'color', value: '#FF0000', label: '빨강', icon: 'red' },
  { mode: 'color', value: '#0000FF', label: '파랑', icon: 'blue' },
  { mode: 'color', value: '#00FF00', label: '초록', icon: 'green' },
  { mode: 'color', value: '#FFFF00', label: '노랑', icon: 'yellow' },
]);

/**
 * @description 굵기
 */
const INITIAL_WIDTH = Object.freeze({
  mode: 'width',
  value: 3,
  label: '3px',
  icon: '3px',
});

const ALLOWED_WIDTH = deepFreeze([
  { mode: 'width', value: 9, label: '9px', icon: '9px' },
  { mode: 'width', value: 7, label: '7px', icon: '7px' },
  { mode: 'width', value: 5, label: '5px', icon: '5px' },
  INITIAL_WIDTH,
  { mode: 'width', value: 1, label: '1px', icon: '1px' },
]);

/**
 * @description 배율
 */
const pct = (v) => `${Math.round(v * 100)}%`;

const INITIAL_SCALE = Object.freeze({
  mode: 'scale',
  value: 1.0,
  label: pct(1),
  icon: '100%',
});

const ALLOWED_SCALE = deepFreeze([
  { mode: 'scale', value: 0.25, label: pct(0.25), icon: '25%' },
  { mode: 'scale', value: 0.5, label: pct(0.5), icon: '50%' },
  { mode: 'scale', value: 0.75, label: pct(0.75), icon: '75%' },
  INITIAL_SCALE,
  { mode: 'scale', value: 1.25, label: pct(1.25), icon: '125%' },
  { mode: 'scale', value: 1.5, label: pct(1.5), icon: '150%' },
  { mode: 'scale', value: 1.75, label: pct(1.75), icon: '175%' },
  { mode: 'scale', value: 2.0, label: pct(2.0), icon: '200%' },
]);

/**
 * @description 회전 스텝
 */
const INITIAL_ROTATE = Object.freeze({
  mode: 'rotate',
  value: 0,
  label: '0°',
  icon: '0deg',
});
const ALLOWED_ROTATE = deepFreeze([
  INITIAL_ROTATE,
  { mode: 'rotate', value: 15, label: '15°', icon: '15deg' },
  { mode: 'rotate', value: 30, label: '30°', icon: '30deg' },
  { mode: 'rotate', value: 45, label: '45°', icon: '45deg' },
  { mode: 'rotate', value: 90, label: '90°', icon: '90deg' },
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
