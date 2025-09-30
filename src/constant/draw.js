/**
 * @file draw.js
 * @author YJH
 * @description 그리기 도구/도형 옵션 정의(불변) 및 유틸
 */
import { deepFreeze } from '../util/deep-freeze';

/**
 * @description 초기값 (도구)
 */
const INITIAL_TOOL = deepFreeze({
  mode: 'tool',
  value: 'brush',
  label: '붓',
});

/**
 * @description 옵션 (도구)
 */
const TOOL_ITEMS = deepFreeze([
  INITIAL_TOOL,
  { mode: 'tool', value: 'eraser', label: '지우개' },
]);

/**
 * @description 옵션 (도형)
 */
const SHAPE_ITEMS = deepFreeze([
  { mode: 'shape', value: 'line', label: '직선' },
  { mode: 'shape', value: 'circle', label: '원' },
  { mode: 'shape', value: 'rect', label: '사각형' },
  { mode: 'shape', value: 'curve', label: '곡선' },
]);

/**
 * @description 그리기 모드 종류
 */
const MODES = deepFreeze(['tool', 'shape', 'text', 'select', 'image']);

/**
 *  @description 드로우 메뉴
 */
const MENU = deepFreeze([...TOOL_ITEMS, ...SHAPE_ITEMS]);

/**
 * @description 비트맵 도구 확인 여부 메서드
 * @param {string} v 비트맵 도구 value
 * @returns {boolean}
 */
const isTool = (v) => TOOL_ITEMS.some((tool) => tool.name === String(v));

/**
 * @description 벡터 도구 확인 여부 메서드
 * @param {string} v 벡터 도구 value
 * @returns {boolean}
 */
const isShape = (v) => SHAPE_ITEMS.some((shape) => shape.name === String(v));

export const DRAW = {
  MENU,
  MODES,
  isTool,
  isShape,
};

/**
 * @description 옵션 (텍스트)
 */
const TEXT_ITEMS = deepFreeze([{ mode: 'text', font: '', label: 'sans' }]);

// const HOTKEYS = deepFreeze({
//   b: 'brush',
//   e: 'eraser',
//   l: 'line',
//   c: 'circle',
//   r: 'rect',
//   v: 'curve',
// });
