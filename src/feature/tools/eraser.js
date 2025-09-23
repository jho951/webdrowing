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

export { EraserTool };
