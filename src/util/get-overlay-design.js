/**
 * @file get-overlay-design.js
 * @author YJH
 */

const DASH = [6, 6];
const DASH_COLOR = 'rgba(0, 0, 0, 0.3)';
const DASH_WIDTH = 2;

/**
 * @description 오버레이 점선 디자인 초기화 유틸
 * @param {*} ctxRef
 * @param {*} fn 적용되는 이벤트
 * @returns
 */
function getOverlayDesign(ctxRef, fn) {
  const ctx = ctxRef?.current;
  if (!ctx || typeof fn !== 'function') return;
  ctx.save();
  ctx.setLineDash(DASH);
  ctx.lineWidth = DASH_WIDTH;
  ctx.strokeStyle = DASH_COLOR;
  fn();
  ctx.restore();
}

export { getOverlayDesign };
