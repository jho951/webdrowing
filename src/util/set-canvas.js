/**
 * @file useCanvasInit
 * @author YJH
 */
import { getContext2d } from './get-context-2d';
import { getDevicePixelRatio } from './get-device-pixel-ratio';

/**
 * @description 캔버스를 초기화하고 DPR을 고려하여 크기 설정하는 함수 (일반 함수로 사용)
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D}
 */
const setupCanvas = (canvas) => {
  const dpr = getDevicePixelRatio();
  const rect = canvas.getBoundingClientRect();

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  const ctx = getContext2d(
    canvas,
    { willReadFrequently: true },
    { alpha: false }
  );

  if (!ctx) throw new Error('2D context 생성 실패');

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;

  return ctx;
};

export { setupCanvas };
