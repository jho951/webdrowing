/**
 * @file DashBoard.jsx
 * @author YJH
 */
import Canvas from '../canvas/Canvas';
import { SIZE } from '../../constant/size';

import Overlay from '../overlay/Overlay';

import './dashBoard.css';
import { useSelector } from 'react-redux';
import { selectActiveShape } from '../../redux/slice/shapeSlice';

/**
 * @description
 * @returns
 */
const DashBoard = () => {
  const activeShape = useSelector(selectActiveShape);
  return (
    <section
      className="dashboard-container"
      style={{ width: `${SIZE.width}px`, height: `${SIZE.height}px` }}
    >
      <Canvas />
      {activeShape.value && <Overlay />}
    </section>
  );
};

export default DashBoard;
