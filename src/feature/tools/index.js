/**
 * @file index.js
 * @author YJH
 */
import { BrushTool } from './brush';
import { EraserTool } from './eraser';

/**
 * @description 도구 맵퍼
 */
const ToolMap = {
  brush: BrushTool,
  eraser: EraserTool,
};

export { ToolMap };
