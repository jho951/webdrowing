/**
 * @file useCanvasInit
 * @author YJH
 */
import { useLayoutEffect } from 'react';
import { getContext2d } from '../util/get-context-2d';
import { getDevicePixelRatio } from '../util/get-device-pixel-ratio';
import { SIZE } from '../constant/size';

/**
 * @description 캔버스를 초기화하고 DPR을 고려하여 크기 설정하는 유틸리티 훅
 * @param {React.RefObject} canvasRef - 캔버스의 ref 객체
 * @param {React.RefObject} ctxRef - 캔버스의 2D 컨텍스트를 담는 ref 객체
 */
const useCanvasInit = (canvasRef, ctxRef) => {
  const DPR = getDevicePixelRatio();

  // 캔버스 초기화 및 컨텍스트 설정
  useLayoutEffect(() => {
    if (canvasRef.current) {
      const ctx = getContext2d(canvasRef.current, { willReadFrequently: true });
      ctxRef.current = ctx;

      // 캔버스 크기 설정
      canvasRef.current.width = Math.round(SIZE.width * DPR);
      canvasRef.current.height = Math.round(SIZE.height * DPR);

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
    }
  }, [canvasRef, ctxRef, DPR]);
};

export { useCanvasInit };
