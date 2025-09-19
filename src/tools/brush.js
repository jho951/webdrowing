const BrushTool = {
  begin(ctx, p) {
    console.log(ctx);
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
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
