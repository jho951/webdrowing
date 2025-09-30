/**
 * @file shape.js
 * @author YJH
 */

/**
 * @description 직선
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

/**
 * @description 원
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

/**
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

/**
 * @description 곡선
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

export const SHAPE_FEATURE = { LineShape, CircleShape, RectShape, CurveShape };
