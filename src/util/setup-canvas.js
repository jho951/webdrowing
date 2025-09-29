/**
 * @file setup-canvas.ts
 * @author YJH
 */

import { getDevicePixelRatio } from './get-device-pixel-ratio';

/**
 * @description 캔버스 초기화, 크기 설정
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D} ctx
 */

function setupCanvas(canvas) {
  const dpr = getDevicePixelRatio();
  const rect = canvas.getBoundingClientRect();

  canvas.style.width = `${Math.round(rect.width)}px`;
  canvas.style.height = `${Math.round(rect.height)}px`;

  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
    alpha: true,
  });
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export { setupCanvas };
