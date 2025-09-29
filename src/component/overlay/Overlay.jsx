/**
 * @file OverlayCanvas.jsx
 * @author YJH
 */
import { useLayoutEffect } from 'react';
import { setupCanvas } from '../../util/canvas/setup-canvas';

/**
 * @description 가이드/마키/미리보기 등을 그리는 오버레이 캔버스 세팅
 * @param {} param0
 * @returns
 */
const Overlay = ({ targetRef }) => {
  useLayoutEffect(() => {
    if (!targetRef || !targetRef.current) return;
    const ctx = setupCanvas(targetRef.current);
    const c = targetRef.current;
    ctx.clearRect(0, 0, c.width, c.height);
  }, [targetRef]);

  return null;
};

export default Overlay;
