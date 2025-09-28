/**
 * @file color.js
 * @author YJH
 * @description 색 설정 값
 */
const INITIAL_COLOR = Object.freeze({
  type: 'basic',
  value: '#000000',
  label: '검정',
});

const ALLOWED_COLOR = Object.freeze([
  INITIAL_COLOR,
  Object.freeze({ type: 'basic', value: '#FFFFFF', label: '흰색' }),
  Object.freeze({ type: 'basic', value: '#FF0000', label: '빨강' }),
  Object.freeze({ type: 'basic', value: '#0000FF', label: '파랑' }),
  Object.freeze({ type: 'basic', value: '#00FF00', label: '초록' }),
  Object.freeze({ type: 'basic', value: '#FFFF00', label: '노랑' }),
]);

export const COLOR = { INITIAL_COLOR, ALLOWED_COLOR };
