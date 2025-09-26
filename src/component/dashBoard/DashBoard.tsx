/**
 * @file DashBoard.jsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from '@/component/bitmap/Bitmap';
import Vector from '@/component/vector/Vector';
import Overlay from '@/component/overlay/Overlay';
import HandleLayer from '@/component/handler/HandleLayer';

import './dashBoard.css';

/**
 *  @description 비트맵, 벡터, 오버레이 3층으로 구성된 대시보드
 */
const DashBoard = () => {
  const bitmapRef = useRef<HTMLCanvasElement>(null);
  const vectorRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const handlerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="dasboard">
      <canvas className="bitmap" ref={bitmapRef} />
      <canvas className="vector" ref={vectorRef} />
      <Bitmap targetRef={bitmapRef} />
      <Vector targetRef={vectorRef} />
      {/* <Overlay
        className="overlay"
        bitmapRef={bitmapRef}
        vectorRef={vectorRef}
        overlayRef={overlayRef}
        handlerRef={handlerRef}
        ref={overlayRef}
      /> */}
      <HandleLayer className="handler" ref={handlerRef} />
    </section>
  );
};

export default DashBoard;
