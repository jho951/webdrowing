const CircleTool = (ctx, x, y, r = 70) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
};
export { CircleTool };
