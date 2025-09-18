/**
 * @file useCanvasInit
 * @author YJH
 */
import { useEffect } from 'react';

/**
 * @description  캔버스를 초기화하고 DPR을 고려하여 크기를 설정하는 유틸리티 훅
 * @param {React.RefObject} canvasRef - 캔버스의 ref 객체
 * @param {Object} size - 캔버스의 크기 (width, height)
 * @param {number} dpr - 디바이스 픽셀 비율
 */
function useCanvasInit(canvasRef, size, dpr) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = Math.round(size.width * dpr);
    canvas.height = Math.round(size.height * dpr);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, [canvasRef, size, dpr]);
}

export { useCanvasInit };
