/**
 * @file canvas.js
 * @author YJH
 * @description 좌표 계산 유틸리티
 */

/**
 * 마우스 이벤트 좌표를 반환
 * - 캔버스 내에서의 상대 좌표가 필요
 *
 * @param {HTMLCanvasElement} canvas - 캔버스
 * @param {MouseEvent|PointerEvent} event - 포인터 이벤트
 *
 * @returns {Object} 캔버스 내 상대 좌표를 포함하는 객체
 * @returns {number} return.x - 캔버스 내 x 좌표
 * @returns {number} return.y - 캔버스 내 y 좌표
 */
function getCanvasPos(canvas, event) {
  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}

/**
 *
 * @param {*} ctx
 * @param {*} style
 */
function applyCtxStyle(ctx, style) {
  ctx.strokeStyle = style?.color ?? '#000000';
  ctx.lineWidth = style?.width ?? 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

/**
 *
 * @param {*} canvas
 * @param {*} img
 * @param {*} padding
 * @returns
 */
function drawImageCentered(canvas, img) {
  const ctx = canvas.getContext('2d');

  const cw = canvas.width;
  const ch = canvas.height;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.min((cw * 2) / iw, (ch * 2) / ih, 1);
  const w = Math.max(1, Math.floor(iw * scale));
  const h = Math.max(1, Math.floor(ih * scale));
  const x = Math.floor((cw - w) / 2);
  const y = Math.floor((ch - h) / 2);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}

export { getCanvasPos, applyCtxStyle, drawImageCentered };
