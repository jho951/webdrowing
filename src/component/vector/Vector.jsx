/**
 * @file VectorCanvas.jsx
 * @author YJH
 */
import { useLayoutEffect } from 'react';
import { setupCanvas } from '../../util/canvas/setup-canvas';

/**
 * @description 벡터 캔버스
 * @returns
 */
const Vector = ({ targetRef }) => {
  useLayoutEffect(() => {
    if (!targetRef || !targetRef.current) return;
    const ctx = setupCanvas(targetRef.current);
    const c = targetRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
  }, [targetRef]);

  return null;
};
export default Vector;
