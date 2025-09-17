/**
 * @file canvas.js\
 * @author YJH
 * @description 캔버스 유틸
 */

/**
 *
 * @param {*} canvas
 * @param {*} param1
 * @returns
 */
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

/**
 * CSS 픽셀 좌표를 반환.
 * - DPR 보정은 컨텍스트 변환으로만 처리하므로 여기선 절대 스케일을 곱하지 않는다.
 * - pointer capture 상황에서도 정확한 좌표를 위해 offsetX/Y를 우선 사용.
 */
function getCanvasPos(canvas, evt) {
  const e = evt?.nativeEvent ?? evt;
  if (
    e &&
    e.target === canvas &&
    typeof e.offsetX === 'number' &&
    typeof e.offsetY === 'number'
  ) {
    return { x: e.offsetX, y: e.offsetY };
  }

  // fallback: viewport 좌표 - 요소 사각형
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX ?? 0) - rect.left;
  const y = (e.clientY ?? 0) - rect.top;
  return { x, y };
}

export { initCanvas, getCanvasPos };
