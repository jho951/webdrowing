function drawShape(ctx, shape) {
    if (!ctx || !shape) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (shape.type === 'line') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
    } else if (shape.type === 'rect') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
        }
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'circle') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fill();
        }
        ctx.stroke();
    } else if (shape.type === 'curve' && shape.kind === 'quadratic') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.quadraticCurveTo(shape.cx, shape.cy, shape.x2, shape.y2);
        ctx.stroke();
    }

    ctx.restore();
}

function renderScene(ctx, items) {
    if (!ctx) return;
    const canvas = ctx.canvas;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const it of items || []) drawShape(ctx, it);
}

export { renderScene };
