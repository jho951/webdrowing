import { SIZE } from '../constant/size';
import { getDevicePixelRatio } from './get-device-pixel-ratio';

/**
 * @file set-canvas
 * @author YJH
 * @description 캔버스 초기화, 크기 설정
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D} ctx
 */
function setupCanvas(canvas) {
  const dpr = getDevicePixelRatio();
  canvas.style.width = `${SIZE.width}px`;
  canvas.style.height = `${SIZE.height}px`;

  const pxW = Math.max(1, Math.round(SIZE.width * dpr));
  const pxH = Math.max(1, Math.round(SIZE.height * dpr));
  if (canvas.width !== pxW) canvas.width = pxW;
  if (canvas.height !== pxH) canvas.height = pxH;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

export { setupCanvas };
