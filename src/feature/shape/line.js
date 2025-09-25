/**
 * @file line.js
 * @author YJH
 */

/**
 * @description 직선 도형
 */
const LineShape = {
  begin(ctx, p, width, color, state = {}) {
    state.start = { x: p.x, y: p.y };
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  },
  draw(ctx, p, _w, _c, state = {}) {
    if (!state.start) return;
    ctx.beginPath();
    ctx.moveTo(state.start.x, state.start.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  },
  end(ctx, p, width, color, state = {}) {
    if (!state.start) {
      ctx.restore();
      return;
    }
    const shape = {
      type: 'line',
      x1: state.start.x,
      y1: state.start.y,
      x2: p.x,
      y2: p.y,
      stroke: color,
      lineWidth: width,
    };
    state.start = null;
    ctx.restore();
    return { shape };
  },
};

export { LineShape };
