/**
 * @file index.js
 * @author YJH
 */

import { CircleTool } from './circle';
import { LineTool } from './line';
import { RectTool } from './rect';
import { StarTool } from './star';

/**
 * @description 도구 맵퍼
 */
const ShapeMap = {
  circle: CircleTool,
  line: LineTool,
  rect: RectTool,
  star: StarTool,
};

export { ShapeMap };
