const RectTool = (ctx, x, y, w = 200, h = 120) => {
  ctx.beginPath();
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
};

export { RectTool };
