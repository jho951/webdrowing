/**
 * @file shape.js
 * @author YJH
 * @description 도구와 도형
 */

/**
 * @description 초기 도형 값
 */
const INITIAL_SHAPE = Object.freeze({
  type: 'shape',
  value: null,
  label: '',
  pointer: '',
});

/**
 * @description 허용 가능한 도형 종류
 */
const ALLOWED_SHAPE = Object.freeze([
  { id: 'shape-line', value: 'line', label: '직선', pointer: 'cross-hair' },
  { type: 'shape-circle', value: 'circle', label: '원', pointer: 'cross-hair' },
  { type: 'shape-rect', value: 'rect', label: '사각형', pointer: 'cross-hair' },
  { type: 'shape-star', value: 'star', label: '별', pointer: 'cross-hair' },
]);

export const SHAPE = { INITIAL_SHAPE, ALLOWED_SHAPE };
