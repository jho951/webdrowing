/**
 * @file index.js
 * @author YJH
 */

import { SHAPE_FEATURE } from './shape';
import { TOOL_FEATURE } from './tool';

/**
 * @description 도구 모음
 */
const ToolMap = {
    brush: TOOL_FEATURE.BrushTool,
    eraser: TOOL_FEATURE.EraserTool,
};

/**
 * @description 도형 모음
 */
const ShapeMap = {
    line: SHAPE_FEATURE.LineShape,
    circle: SHAPE_FEATURE.CircleShape,
    rect: SHAPE_FEATURE.RectShape,
};

export { ToolMap, ShapeMap };
