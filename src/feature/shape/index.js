/**
 * @file feature/shape/index.js
 * @author YJH
 * @description 도형 모음
 */

import { CircleShape } from './circle';
import { LineShape } from './line';
import { RectShape } from './rect';

const ShapeMap = {
  rect: RectShape,
  circle: CircleShape,
  line: LineShape,
  // curve: CurveTool, // 2-스텝 도구도 추가 가능
};

export { ShapeMap };
