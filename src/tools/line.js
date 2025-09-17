const LineTool = (ctx, x, y, size = 160) => {
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2);
  ctx.lineTo(x + size / 2, y + size / 2);
  ctx.stroke();
};

export { LineTool };
