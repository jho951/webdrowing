function drawRect(ctx, s) {
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = s.lineWidth ?? 2;
  ctx.lineCap = s.lineCap ?? 'round';
  ctx.lineJoin = s.lineJoin ?? 'round';
  ctx.strokeStyle = s.stroke ?? '#222';
  if (s.fill) {
    ctx.fillStyle = s.fill;
    ctx.fillRect(s.x, s.y, s.w, s.h);
  }
  ctx.strokeRect(s.x, s.y, s.w, s.h);
  s;
  ctx.restore();
}

function drawCircle(ctx, s) {
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = s.lineWidth ?? 2;
  ctx.lineCap = s.lineCap ?? 'round';
  ctx.lineJoin = s.lineJoin ?? 'round';
  ctx.strokeStyle = s.stroke ?? '#222';
  ctx.beginPath();
  ctx.arc(s.cx, s.cy, s.r, 0, Math.PI * 2);
  if (s.fill) {
    ctx.fillStyle = s.fill;
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
}
function drawLine(ctx, s) {
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = s.lineWidth ?? 2;
  ctx.lineCap = s.lineCap ?? 'round';
  ctx.lineJoin = s.lineJoin ?? 'round';
  ctx.strokeStyle = s.stroke ?? '#222';
  ctx.beginPath();
  ctx.moveTo(s.x1, s.y1);
  ctx.lineTo(s.x2, s.y2);
  ctx.stroke();
  ctx.restore();
}

function renderVectorScene(ctx, shapes = []) {
  for (const s of shapes) {
    switch (s.type) {
      case 'rect':
        drawRect(ctx, s);
        break;
      case 'circle':
        drawCircle(ctx, s);
        break;
      case 'line':
        drawLine(ctx, s);
        break;

      default:
        break;
    }
  }
}

export { renderVectorScene };
