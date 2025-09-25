export const DASH = [6, 6];
export const HANDLE_SIZE = 10;

export function drawRectDashed(ctx, bbox, color = 'rgba(0,0,0,0.9)') {
  if (!ctx || !bbox) return;
  ctx.save();
  ctx.setLineDash(DASH);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h);
  ctx.restore();
}

export function drawSelectionBoxWithHandles(
  ctx,
  bbox,
  color = 'rgba(0,0,0,0.9)'
) {
  if (!ctx || !bbox) return;
  drawRectDashed(ctx, bbox, color);
  const hs = [
    { x: bbox.x, y: bbox.y },
    { x: bbox.x + bbox.w / 2, y: bbox.y },
    { x: bbox.x + bbox.w, y: bbox.y },
    { x: bbox.x + bbox.w, y: bbox.y + bbox.h / 2 },
    { x: bbox.x + bbox.w, y: bbox.y + bbox.h },
    { x: bbox.x + bbox.w / 2, y: bbox.y + bbox.h },
    { x: bbox.x, y: bbox.y + bbox.h },
    { x: bbox.x, y: bbox.y + bbox.h / 2 },
  ];
  ctx.save();
  ctx.setLineDash([]);
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = color;
  for (const h of hs) {
    ctx.beginPath();
    ctx.rect(
      h.x - HANDLE_SIZE / 2,
      h.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}
