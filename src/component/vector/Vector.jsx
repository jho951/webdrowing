import { useLayoutEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { selectActiveShape } from '../../redux/slice/shapeSlice';
import { setupCanvas } from '../../util/set-canvas';

import './vector.css';

const Vector = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const shapes = useSelector(selectActiveShape);
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    ctxRef.current = setupCanvas(canvasRef.current);
  }, []);
  return <canvas />;
};

export default Vector;
