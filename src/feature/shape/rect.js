/**
 * @file rect.js
 * @author YJH
 * @description 사각형
 */
const RectShape = {
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
    const x = Math.min(state.start.x, p.x);
    const y = Math.min(state.start.y, p.y);
    const w = Math.abs(p.x - state.start.x);
    const h = Math.abs(p.y - state.start.y);
    ctx.beginPath();
    ctx.strokeRect(x, y, w, h);
  },
  end(ctx, p, width, color, state = {}) {
    if (!state.start) {
      ctx.restore();
      return;
    }
    const shape = {
      type: 'rect',
      x: Math.min(state.start.x, p.x),
      y: Math.min(state.start.y, p.y),
      w: Math.abs(p.x - state.start.x),
      h: Math.abs(p.y - state.start.y),
      stroke: color,
      lineWidth: width,
    };
    state.start = null;
    ctx.restore();
    return { shape };
  },
};

export { RectShape };
