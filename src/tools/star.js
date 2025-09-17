const StarTool = (ctx, x, y, r = 70, spikes = 5) => {
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  for (let i = 0; i < spikes * 2; i++) {
    const ang = -Math.PI / 2 + i * step;
    const radius = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(x + Math.cos(ang) * radius, y + Math.sin(ang) * radius);
  }
  ctx.closePath();
  ctx.stroke();
};

export { StarTool };
