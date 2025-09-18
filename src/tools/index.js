import { BrushTool } from './brush';
import { CircleTool } from './circle';
import { EraserTool } from './eraser';
import { LineTool } from './line';
import { RectTool } from './rect';
import { StarTool } from './star';

/**
 *
 * @param {*} fn
 * @returns
 */
const oneShot = (fn) => ({
  begin(ctx, p) {
    ctx.save();
    fn(ctx, p.x, p.y);
    ctx.restore();
  },
  draw() {},
  end() {},
});

const REGISTRY = {
  brush: BrushTool,
  eraser: EraserTool,
  line: LineTool,
  rect: oneShot(RectTool),
  star: oneShot(StarTool),
  circle: oneShot(CircleTool),
};

/**
 *
 * @param {*} name
 * @returns
 */
function getTool(name) {
  return REGISTRY[name] ?? BrushTool;
}

export { getTool };
