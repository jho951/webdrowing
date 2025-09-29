/**
 * @file get-device-pixel-ratio.js
 * @author YJH
 * @description 디바이스 픽셀 비율을 반환
 * @return window.devicePixelRatio || 1
 */
function getDevicePixelRatio() {
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
  const n = Number(dpr);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export { getDevicePixelRatio };
