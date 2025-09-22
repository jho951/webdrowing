import Canvas from '../canvas/Canvas';
import { SIZE } from '../../constant/size';

import './dashBoard.css';

const DashBoard = () => {
  return (
    <section
      className="dashboard-container"
      style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}
    >
      <Canvas size={SIZE} />
    </section>
  );
};

export default DashBoard;
