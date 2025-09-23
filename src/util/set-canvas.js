/**
 * @file useCanvasInit
 * @author YJH
 */
import { SIZE } from '../constant/size';
import { getContext2d } from './get-context-2d';
import { getDevicePixelRatio } from './get-device-pixel-ratio';

/**
 * @description 캔버스를 초기화하고 크기 설정 (DPR 고려)
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D} ctx
 */
const setupCanvas = (canvas) => {
  const dpr = getDevicePixelRatio();
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(SIZE.width + rect.width * dpr);
  canvas.height = Math.round(SIZE.height + rect.height * dpr);

  const ctx = getContext2d(canvas, { willReadFrequently: true });
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
};

export { setupCanvas };
