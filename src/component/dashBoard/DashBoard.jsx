/**
 * @file DashBoard.tsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from '@/component/bitmap/Bitmap';
import Vector from '@/component/vector/Vector';
import Overlay from '@/component/overlay/Overlay';
import HandleLayer from '@/component/handler/HandleLayer';

import './dashBoard.css';

/**
 *  @description 비트맵, 벡터, 오버레이 3겹 + 핸들 레이어
 */
const DashBoard = () => {
  const bitmapRef  = useRef(null);
  const vectorRef  = useRef(null);
  const overlayRef = useRef(null);
  const handlerRef = useRef(null);

  return (
    <section className="dashboard">
      <canvas className="bitmap" ref={bitmapRef} />
      <canvas className="vector" ref={vectorRef} />

      <Bitmap targetRef={bitmapRef} />
      <Vector targetRef={vectorRef} />

      <Overlay
        className="overlay"
        bitmapRef={bitmapRef}
        vectorRef={vectorRef}
        overlayRef={overlayRef}
        ref={overlayRef}    
      />
      <HandleLayer className="handler" ref={handlerRef} />
    </section>
  );
};

export default DashBoard;
