/**
 * @file set-canvas.ts
 * @author YJH
 */
import { SIZE } from '@/constant/size';
import { getDevicePixelRatio } from '@/util/canvas/get-device-pixel-ratio';

/**
 * @description 캔버스 초기화, 크기 설정
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D} ctx
 */
 function setupCanvas(canvas) {
  const dpr = getDevicePixelRatio();

  // CSS 픽셀 크기
  canvas.style.width = `${SIZE.width}px`;
  canvas.style.height = `${SIZE.height}px`;

  // 실제 픽셀 크기(DPR 반영)
  const pxW = Math.max(1, Math.round(SIZE.width * dpr));
  const pxH = Math.max(1, Math.round(SIZE.height * dpr));
  if (canvas.width !== pxW) canvas.width = pxW;
  if (canvas.height !== pxH) canvas.height = pxH;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D context를 가져올 수 없습니다.');

  // 좌표계를 CSS px 기준으로 맞춤
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;

  return ctx;
}


export{setupCanvas}