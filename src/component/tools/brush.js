const BrushTool = {
  begin(ctx, p, style) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = style.color ?? '#000';
    ctx.lineWidth = style.width ?? 5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  },
  draw(ctx, p) {
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  },
  end(ctx) {
    // 필요시 마무리 처리
  },
};

export { BrushTool };
