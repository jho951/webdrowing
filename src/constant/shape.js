/**
 * @file shape.js
 * @desc 벡터 도형 정의 (Overlay + VectorToolMap 연동)
 */

const INITIAL_SHAPE = Object.freeze({
  kind: 'shape',
  value: null,
  label: '',
  cursor: 'default',
});

const ALLOWED_SHAPE = Object.freeze([
  { kind: 'shape', value: 'line', label: '직선', cursor: 'crosshair' },
  { kind: 'shape', value: 'circle', label: '원', cursor: 'crosshair' },
  { kind: 'shape', value: 'rect', label: '사각형', cursor: 'crosshair' },
  { kind: 'shape', value: 'curve', label: '곡선', cursor: 'crosshair' },
]);

export const SHAPE = { INITIAL_SHAPE, ALLOWED_SHAPE };
