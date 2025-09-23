/**
 * @file index.js
 * @author YJH
 */

import { SHAPE } from '../../constant/shape';
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

const rectFromBox = ({ x, y, w, h, color, width }) => {
  return {
    id: `${color}, ${x},${width + w}`,
    type: ShapeMap.rect,
    x,
    y,
    w,
    h,
    color,
    width,
  };
};

const renderShape = (ctx, shape, color, lineWidth) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  for (const s of SHAPE.ALLOWED_SHAPE) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
  }
};

export { ShapeMap, rectFromBox };
