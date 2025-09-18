/**
 * @file canvas.js
 * @author YJH
 * @description 좌표 계산 유틸리티
 */

import { getTool } from '../tools';

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
  if (
    event.target === canvas &&
    typeof event.offsetX === 'number' &&
    typeof event.offsetY === 'number'
  ) {
    return { x: event.offsetX, y: event.offsetY };
  }

  const rect = canvas.getBoundingClientRect();

  const x = (event.clientX ?? 0) - rect.left;
  const y = (event.clientY ?? 0) - rect.top;
  // console.log(rect);
  // console.log(x, y);
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
 * @param {*} shape
 * @param {*} style
 * @param {*} param3
 * @returns
 */
function renderShapeOnceAt(canvas, shape, style, { x, y }) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  applyCtxStyle(ctx, style);

  const shapeTool = getTool(shape);
  shapeTool.begin(ctx, { x, y });
  if (typeof shapeTool.end === 'function') {
    shapeTool.end(ctx);
  }
}

/**
 *
 * @param {*} canvas
 * @param {*} shape
 * @param {*} style
 * @returns
 */
function renderShapeOnceAtCenter(canvas, shape, style) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const center = { x: rect.width / 2, y: rect.height / 2 };
  renderShapeOnceAt(canvas, shape, style, center);
}

/**
 *
 * @param {*} canvas
 * @param {*} img
 * @param {*} padding
 * @returns
 */
function drawImageCentered(canvas, img, padding = 16) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const cw = canvas.width;
  const ch = canvas.height;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.min((cw - padding * 2) / iw, (ch - padding * 2) / ih, 1);
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

export {
  getCanvasPos,
  applyCtxStyle,
  renderShapeOnceAt,
  renderShapeOnceAtCenter,
  drawImageCentered,
};
