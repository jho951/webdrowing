import { BrushTool } from './brush';
import { CircleTool } from './circle';
import { EraserTool } from './eraser';
import { LineTool } from './line';
import { RectTool } from './rect';
import { StarTool } from './star';

const REGISTRY = {
  brush: BrushTool,
  eraser: EraserTool,
};

const SHAPEREGISTRY = {
  line: LineTool,
  rect: RectTool,
  star: StarTool,
  circle: CircleTool,
};

function getTool(name) {
  return REGISTRY[name] ?? BrushTool;
}

function getShape(name) {
  return SHAPEREGISTRY[name];
}

export { getTool, getShape };
