/**
 * @file OverlayCanvas.jsx
 * @author YJH
 */
import { useLayoutEffect, useRef } from 'react';
import { setupCanvas } from '../../util/setup-canvas';
import { resetCanvas } from '../../util/reset-canvas';

/**
 * @description 가이드/마키/미리보기 등을 그리는 오버레이 캔버스 세팅
 */
function Overlay({ targetRef }) {
  const ctxRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = targetRef?.current;
    if (!canvas) return;
    const ctx = setupCanvas(canvas);
    ctxRef.current = ctx;

    // resize 핸들러 함수
    const handleResize = () => resetCanvas(targetRef, ctx);

    // ResizeObserver에는 콜백 함수만 넘겨야 함
    const ro = new ResizeObserver(handleResize);
    ro.observe(canvas);

    // window resize 이벤트도 동일하게 처리
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [targetRef]);

  return null;
}

export default Overlay;
