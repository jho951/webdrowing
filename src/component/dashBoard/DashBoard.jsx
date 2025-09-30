/**
 * @file DashBoard.tsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from '../bitmap/Bitmap';
import Vector from '../vector/Vector';
import Overlay from '../overlay/Overlay';

import './dashboard.css';
import { useSelector } from 'react-redux';
import { selectGlobalMode } from '../../redux/slice/modeSlice';

/**
 * @description 비트맵, 벡터, 오버레이 3겹의 캔버스
 * @returns dashboard
 */
function DashBoard() {
  const bitmapRef = useRef(null);
  const vectorRef = useRef(null);
  const overlayRef = useRef(null);
  const mode = useSelector(selectGlobalMode);

  return (
    <section className="dashboard">
      <canvas className="bitmap" ref={bitmapRef} />
      <canvas className="vector" ref={vectorRef} />
      <canvas className="overlay" ref={overlayRef} />
      <Bitmap canvasRef={bitmapRef} />
      <Vector canvasRef={vectorRef} />
      <Overlay canvasRef={overlayRef} bitmapRef={bitmapRef} />
    </section>
  );
}
export default DashBoard;
