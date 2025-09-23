/**
 * @file DashBoard.jsx
 * @author YJH
 */
import Bitmap from '../bitmap/Bitmap';
import Vector from '../vector/Vector';
import Overlay from '../overlay/Overlay';

import { SIZE } from '../../constant/size';

import './dashBoard.css';

/**
 * @description
 * @returns
 */
const DashBoard = () => {
  return (
    <section
      className="dashboard-container"
      style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}
    >
      <Bitmap />
      <Vector />
      <Overlay />
    </section>
  );
};

export default DashBoard;
