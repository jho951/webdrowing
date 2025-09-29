import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setupCanvas } from '../../util/setup-canvas';
import { bitmapHistory } from '../../util/bitmap-history';
import { pushBitmapSnapshot } from '../../redux/slice/historySlice';


function Bitmap({ canvasRef }) {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = setupCanvas(canvas);
    const h = bitmapHistory();
    h.init(canvas, ctx, 10);
    h.resetToEmpty();
    dispatch(pushBitmapSnapshot);
  }, [canvasRef, dispatch]);
  return null;
}

export default Bitmap;
