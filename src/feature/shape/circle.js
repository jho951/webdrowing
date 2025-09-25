/**
 * @file circle.js
 * @author YJH
 */
const CircleShape = {
  begin(ctx, p, width, color, state = {}) {
    state.start = { x: p.x, y: p.y };
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  },
  draw(ctx, p, _w, _c, state = {}) {
    if (!state.start) return;
    const r = Math.hypot(p.x - state.start.x, p.y - state.start.y);
    ctx.beginPath();
    ctx.arc(state.start.x, state.start.y, r, 0, Math.PI * 2);
    ctx.stroke();
  },
  end(ctx, p, width, color, state = {}) {
    if (!state.start) {
      ctx.restore();
      return;
    }
    const r = Math.hypot(p.x - state.start.x, p.y - state.start.y);
    const shape = {
      type: 'circle',
      cx: state.start.x,
      cy: state.start.y,
      r,
      stroke: color,
      lineWidth: width,
    };
    state.start = null;
    ctx.restore();
    return { shape };
  },
};

export { CircleShape };
