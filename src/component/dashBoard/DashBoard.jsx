import Canvas from '../canvas/Canvas';
import DefaultState from '../../constant';
import { useDevicePixelRatio } from '../../hook/useDevicePixelRatio';

import './dashBoard.css';

const DashBoard = () => {
  const { SIZE } = DefaultState;
  const DPR = useDevicePixelRatio();

  return (
    <section
      className="dashboard-container"
      style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas size={SIZE} dpr={DPR} />
    </section>
  );
};

export default DashBoard;
