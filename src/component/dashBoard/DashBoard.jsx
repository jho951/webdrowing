/**
 * @file DashBoard.tsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from '../bitmap/Bitmap';
import Handler from '../handler/Handler';

import './dashboard.css';

/**
 *  @description 비트맵, 벡터, 오버레이 3겹 + 핸들 레이어
 */
function DashBoard() {
  const bitmapRef = useRef(null);
  const vectorRef = useRef(null);

  return (
    <section className="dashboard">
      <canvas className="bitmap" ref={bitmapRef} />
      <canvas className="vector" ref={vectorRef} />
      <Bitmap canvasRef={bitmapRef} />
      <Handler bitmapRef={bitmapRef} />
    </section>
  );
}
export default DashBoard;
