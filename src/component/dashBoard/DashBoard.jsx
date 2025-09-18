import Canvas from '../canvas/Canvas';
import { SIZE } from '../../constant/size';
import { useDevicePixelRatio } from '../../hook/useDevicePixelRatio';

import './dashBoard.css';

const DashBoard = () => {
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
