/**
 * @file tool.js
 * @author YJH
 * @description 도구와 도형
 */

/**
 * @description 초기 도구 값
 */
const INITIAL_TOOL = Object.freeze({
  type: 'tool',
  value: 'brush',
  label: '붓',
  pointer: 'cross-hair',
});

/**
 * @description 허용 가능한 도구 종류
 */
const ALLOWED_TOOL = Object.freeze([
  { type: 'tool', value: 'brush', label: '붓', pointer: 'cross-hair' },
  { type: 'tool', value: 'eraser', label: '지우개', pointer: 'cross-hair' },
]);

export const TOOL = { INITIAL_TOOL, ALLOWED_TOOL };
