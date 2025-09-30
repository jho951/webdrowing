/**
 * @file tppl.js
 * @author YJH
 * @description 비트맵 도구 상수
 */

import { deepFreeze } from '../util/deep-freeze';
import { getId } from '../util/get-id';

const SHAPE_TYPE = 'shape';
/**
 * @description 옵션 (도형)
 */
const SHAPES = deepFreeze([
  {
    id: getId(),
    type: SHAPE_TYPE,
    mode: SHAPE_TYPE,
    payload: 'line',
    name: '직선',
    icon: 'line',
    shortcut: 'L',
    cursor: 'crosshair',
  },
  {
    id: getId(),
    type: SHAPE_TYPE,
    mode: SHAPE_TYPE,
    payload: 'circle',
    name: '원',
    icon: 'circle',
    shortcut: 'C',
    cursor: 'crosshair',
  },
  {
    id: getId(),
    type: SHAPE_TYPE,
    mode: SHAPE_TYPE,
    payload: 'rect',
    name: '사각형',
    icon: 'rect',
    shortcut: 'R',
    cursor: 'crosshair',
  },
  {
    id: getId(),
    type: SHAPE_TYPE,
    mode: SHAPE_TYPE,
    payload: 'curve',
    name: '곡선',
    icon: 'curve',
    shortcut: 'C',
    cursor: 'crosshair',
  },
]);

const SHAPES_VALUE = SHAPES.flat().map((item) => item.payload);

export const SHAPE = { SHAPE_TYPE, SHAPES, SHAPES_VALUE };
