import { BrushTool } from './brush';
import { EraserTool } from './eraser';

const REGISTRY = {
  brush: BrushTool,
  eraser: EraserTool,
  // Todo... text: TextTool, rect: RectTool, circle: CircleTool ... 적용
};

export function getTool(name) {
  return REGISTRY[name] ?? BrushTool;
}
