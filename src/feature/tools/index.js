/**
 * @file index.js
 * @author YJH
 * @description 도구 모음
 */
import { BrushTool } from './brush';
import { EraserTool } from './eraser';

const ToolMap = {
  brush: BrushTool,
  eraser: EraserTool,
};

export { ToolMap };
