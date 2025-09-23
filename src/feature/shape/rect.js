/**
 * @file rect.js
 * @author YJH
 */
const RectTool = (() => {
  let startPoint = null;

  const getRectPath = (p0, p1) => {
    const x = Math.min(p0.x, p1.x);
    const y = Math.min(p0.y, p1.y);
    const w = Math.abs(p1.x - p0.x);
    const h = Math.abs(p1.y - p0.y);
    return { x, y, w, h };
  };

  return {
    begin(ctx, point) {
      startPoint = point;
    },

    draw(ctx, currentPoint) {
      if (!startPoint) return;

      ctx.save();

      const { x, y, w, h } = getRectPath(startPoint, currentPoint);

      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    },

    end(ctx, currentPoint) {
      if (!startPoint) return null;
      const box = {
        x: Math.min(startPoint.x, currentPoint.x),
        y: Math.min(startPoint.y, currentPoint.y),
        w: Math.abs(currentPoint.x - startPoint.x),
        h: Math.abs(currentPoint.y - startPoint.y),
      };
      startPoint = null;
      return box;
    },
  };
})();

export { RectTool };
