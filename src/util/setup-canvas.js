/**
 * @file set-canvas.ts
 * @author YJH
 */

/**
 * @description 캔버스 초기화, 크기 설정
 * @param {HTMLCanvasElement} canvas
 * @returns {CanvasRenderingContext2D} ctx
 */
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export { setupCanvas };
