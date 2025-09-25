/**
 * @file curve.js
 * @author YJH
 */
const CurveShape = {
  begin(ctx, p, color, width, state) {
    ctx.save();
    if (!state.phase) {
      state.phase = 'placingEnd';
      state.p0 = { x: p.x, y: p.y };
    } else {
      state.phase = 'placingCtrl';
    }
  },
  draw(ctx, p, color, width, state) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();

    if (state.phase === 'placingEnd') {
      ctx.moveTo(state.p0.x, state.p0.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    } else if (state.phase === 'placingCtrl') {
      ctx.moveTo(state.p0.x, state.p0.y);
      ctx.quadraticCurveTo(p.x, p.y, state.p1.x, state.p1.y);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(state.p0.x, state.p0.y);
      ctx.lineTo(p.x, p.y);
      ctx.lineTo(state.p1.x, state.p1.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  },
  end(ctx, p, color, width, state) {
    if (state.phase === 'placingEnd') {
      state.p1 = { x: p.x, y: p.y };
      state.phase = 'placingCtrl-ready';
      ctx.restore();
      return { pending: true };
    }

    if (state.phase === 'placingCtrl') {
      const shape = {
        id: null,
        type: 'curve',
        kind: 'quadratic',
        x1: state.p0.x,
        y1: state.p0.y,
        x2: state.p1.x,
        y2: state.p1.y,
        cx: p.x,
        cy: p.y,
        stroke: color,
        lineWidth: width,
      };
      ctx.restore();

      state.phase = null;
      return { shape };
    }

    ctx.restore();
    return { pending: true };
  },
};

export { CurveShape };
