/**
 * @file DashBoard.tsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from '../bitmap/Bitmap';
import Vector from '../vector/Vector';
import Overlay from '../overlay/Overlay';

import HandleLayer from '../handler/HandleLayer';

import './dashboard.css';

/**
 *  @description 비트맵, 벡터, 오버레이 3겹 + 핸들 레이어
 */
const DashBoard = () => {
  const bitmapRef = useRef(null);
  const vectorRef = useRef(null);
  const overlayRef = useRef(null);
  const handlerRef = useRef(null);

  return (
    <section className="dashboard">
      <canvas className="bitmap" ref={bitmapRef} />
      <canvas className="vector" ref={vectorRef} />
      <canvas className="overlay" ref={overlayRef} />

      <Bitmap targetRef={bitmapRef} />
      <Vector targetRef={vectorRef} />
      <Overlay targetRef={overlayRef} />
      <HandleLayer
        className="handler"
        ref={handlerRef}
        bitmapRef={bitmapRef}
        vectorRef={vectorRef}
        overlayRef={overlayRef}
      />
    </section>
  );
};

export default DashBoard;
