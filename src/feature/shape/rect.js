/**
 * @file rect.js
 * @author YJH
 */
const RectTool = (() => {
  let startPoint = null;

  return {
    begin(ctx, point) {
      startPoint = point;
    },

    draw(ctx, currentPoint) {
      if (!startPoint) return;

      const x = Math.min(startPoint.x, currentPoint.x);
      const y = Math.min(startPoint.y, currentPoint.y);
      const width = Math.abs(currentPoint.x - startPoint.x);
      const height = Math.abs(currentPoint.y - startPoint.y);

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeRect(x, y, width, height);

      ctx.restore();
    },

    end(ctx) {
      startPoint = null;
    },
  };
})();

export { RectTool };
