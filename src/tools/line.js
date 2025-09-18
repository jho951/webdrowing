/**
 * @file line.js
 * @author YJH
 */

/**
 * @description 직선 도형
 */
const LineTool = {
  begin(ctx, p) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.moveTo(p.x / 2, p.y / 2);
  },
  draw(ctx, p) {
    ctx.lineTo(p.x / 2, p.y / 2);
    ctx.stroke;
  },
  end(ctx) {
    ctx.restore();
  },
};
export { LineTool };
