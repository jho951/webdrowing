/**
 * @file style.js
 * @author YJH
 * @description 도형과 도구 색과 굵기
 */

/**
 *
 */
const INITIAL_WIDTH = Object.freeze({
  value: 3,
  label: 'normal',
});

/**
 *
 */
const ALLOWED_WIDTH = Object.freeze([
  { value: 9, label: '9px' },
  { value: 7, label: '7px' },
  { value: 5, label: '5px' },
  { value: 3, label: '3px' },
  { value: 1, label: '1px' },
]);

export const WIDTH = { INITIAL_WIDTH, ALLOWED_WIDTH };
