/**
 * @file BitmapCanvas.jsx
 * @author YJH
 */
import { useLayoutEffect } from 'react';
import { setupCanvas } from '../../util/setup-canvas';
import { bitmapHistory } from '../../util/bitmap-history';

/**
 * @description 비트맵 기반 캔버스
 */
function Bitmap({ targetRef }) {
  useLayoutEffect(() => {
    const canvas = targetRef?.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    bitmapHistory().init(canvas, ctx, 10);
  }, [targetRef]);
  return null;
}

export default Bitmap;
