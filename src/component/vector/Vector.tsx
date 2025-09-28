/**
 * @file VectorCanvas.jsx
 * @author YJH
 */
import React, { useLayoutEffect } from 'react';
import { setupCanvas } from '@/util/canvas/setup-canvas';


interface VectorProps {
  targetRef: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * @description 벡터 캔버스
 * @returns
 */
const Vector: React.FC<VectorProps> = ({ targetRef }) => {
  useLayoutEffect(() => {
    if (!targetRef || !targetRef.current) return;
    const ctx = setupCanvas(targetRef.current);
    const c = targetRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
  }, [targetRef]);

  return null;
};
export default Vector;
