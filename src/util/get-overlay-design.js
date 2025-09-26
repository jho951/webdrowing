/**
 * @file get-overlay-design.js
 * @author YJH
 * @description 오버레이 점선 디자인 초기화 유틸
 * @param {*} ctxRef
 * @param {*} fn 적용되는 이벤트
 */
function getOverlayDesign(ctxRef, fn) {
  const ctx = ctxRef.current;
  if (!ctx) return;
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = ' rgba(0, 0, 0, 0.3)';
  fn();
  ctx.restore();
}

export { getOverlayDesign };
