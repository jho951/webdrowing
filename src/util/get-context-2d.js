/**
 * @file canvasCtx.js
 * @author YJH
 */
const CTX_CACHE = new WeakMap();

/**
 * 최초 1회만 getContext('2d') 하고 재사용.
 * 속도 비교 필요
 * @param {*} canvas // 2D 컨텍스트 요소
 * @param {*} opts // 설정 옵션
 * @returns ctx
 */
function getContext2d(canvas, opts) {
  if (!canvas) return null;
  // 키를 통해 확인
  let ctx = CTX_CACHE.get(canvas);

  if (!ctx) {
    ctx = canvas.getContext('2d', opts);
    CTX_CACHE.set(canvas, ctx);
  }
  return ctx;
}

export { getContext2d };
