const getRectPath = (ctx, x0, y0, x1, y1) => {
  const x = Math.min(x0, x1);
  const y = Math.min(y0, y1);
  const w = Math.abs(x1 - x0);
  const h = Math.abs(y1 - y0);
  ctx.rect(x, y, w, h);
};

const getLinePath = (ctx, x0, y0, x1, y1) => {
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
};
export { getRectPath, getLinePath };
