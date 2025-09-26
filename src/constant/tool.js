/**
 * @file tool.js
 * @desc 비트맵 도구 정의 (Base 레이어에서 바로 커밋)
 */

const INITIAL_TOOL = Object.freeze({
  kind: 'tool',
  value: 'brush',
  label: '붓',
});

const ALLOWED_TOOL = Object.freeze([
  { kind: 'tool', value: 'brush', label: '붓' },
  { kind: 'tool', value: 'eraser', label: '지우개' },
]);

export const TOOL = { INITIAL_TOOL, ALLOWED_TOOL };
