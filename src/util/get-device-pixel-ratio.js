/**
 * @file get-device-pixel-ratio.js
 * @author YJH
 * @description 디바이스 픽셀 비율을 반환하는 훅, 브라우저 환경이 아닐 경우 fallback으로 1을 반환
 * @return window.devicePixelRatio || 1
 */
function getDevicePixelRatio() {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

export { getDevicePixelRatio };
