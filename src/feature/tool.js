// feature/tool.js
const BrushTool = {
    begin(ctx, p, width, color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    },
    draw(ctx, p) {
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    },
    end(ctx) {
        ctx.restore();
    },
};

const EraserTool = {
    begin(ctx, p, width) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    },
    draw(ctx, p) {
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    },
    end(ctx) {
        ctx.restore();
    },
};

export const ToolMap = {
    brush: BrushTool,
    eraser: EraserTool,
};
