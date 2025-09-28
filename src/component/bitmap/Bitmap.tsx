/**
 * @file BitmapCanvas.jsx
 * @author YJH
 */
import React, { useLayoutEffect } from 'react';
import { setupCanvas } from '@/util/canvas/setup-canvas';
import { bitmapHistory } from '@/util/bitmap/bitmap-history';

interface BitmapProps {
  targetRef: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * @description 비트맵 기반 캔버스
 */
const Bitmap: React.FC<BitmapProps> = ({ targetRef }) => {
  useLayoutEffect(() => {
    if (!targetRef || !targetRef.current) return;
    const ctx = setupCanvas(targetRef.current);
    bitmapHistory().init(targetRef.current, ctx, 10);
  }, [targetRef]);

  return null;
};

export default Bitmap;
