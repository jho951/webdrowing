import BitmapCanvas from '../bitmap/BitmapCanvas';
import VectorCanvas from '../vector/VectorCanvas';
import ShapeOverlayCanvas from '../overlay/ShapeOverlayCanvas';

import './dashBoard.css';

/**
 * @file DashBoard.jsx
 * @author YJH
 * @description 레이어가 쌓여 있는 캔버스 현재 3중으로 적용
 */
const DashBoard = () => {
  return (
    <section className="dashboard-wrap">
      <BitmapCanvas />
      <VectorCanvas />
      {/* <TextCanvas />
      <ImageCanvas /> */}
      <ShapeOverlayCanvas />
      {/* <AreaOverlayCanvas /> */}
    </section>
  );
};

export default DashBoard;
