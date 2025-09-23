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

export { BrushTool };
