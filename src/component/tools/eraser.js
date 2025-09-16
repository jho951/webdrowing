const EraserTool = {
  begin(ctx, p, style) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = style.width ?? 20;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  },
  draw(ctx, p) {
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  },
  end(ctx) {},
};

export { EraserTool };
