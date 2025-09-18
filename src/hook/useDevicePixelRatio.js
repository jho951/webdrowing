/**
 * @file useDevicePixelRatio.js
 * @author
 */
import { useMemo } from 'react';

/**
 * @description 디바이스 픽셀 비율을 반환하는 훅 브라우저 환경이 아닐 경우 fallback으로 1을 반환
 */
function useDevicePixelRatio() {
  return useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  }, []);
}

export { useDevicePixelRatio };
