function initCanvas(canvas, { width = 800, height = 500 } = {}) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  return ctx;
}
function getCanvasPos(canvas, e) {
  const ev = e.nativeEvent ?? e;
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  return { x, y };
}

export { initCanvas, getCanvasPos };
