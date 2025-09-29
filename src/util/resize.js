import { setupCanvas } from './setup-canvas';

function resizeBitmapLayer(bitmapCanvas, nextCssW, nextCssH, dpr) {
  const prevW = bitmapCanvas.width;
  const prevH = bitmapCanvas.height;
  if (prevW === 0 || prevH === 0) {
    return setupCanvas(bitmapCanvas, nextCssW, nextCssH, dpr);
  }

  const off = document.createElement('canvas');
  off.width = prevW;
  off.height = prevH;
  const offCtx = off.getContext('2d');
  offCtx.drawImage(bitmapCanvas, 0, 0);

  const ctx = setupCanvas(bitmapCanvas, nextCssW, nextCssH, dpr);

  const prevCssW = prevW / dpr;
  const prevCssH = prevH / dpr;

  ctx.save();
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(off, 0, 0, prevW, prevH, 0, 0, nextCssW, nextCssH);
  ctx.restore();

  return ctx;
}

export { resizeBitmapLayer };
