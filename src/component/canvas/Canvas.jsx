/**
 * @file Canvas.jsx
 * @author YJH
 * @descrition 대시보드 내 상호작용 컴포넌트
 */
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCanvasDraw } from '../../hook/useCanvasDraw';
import ToolStore from '../../redux/slice/toolSlice';
import { DEFAULT_SIZE } from '../../constant/defaultSize';
import './canvas.css';

const getInitialSize = () => {
  const savedWidth = localStorage.getItem('canvasWidth');
  const savedHeight = localStorage.getItem('canvasHeight');
  return {
    width: savedWidth ? parseInt(savedWidth, 10) : DEFAULT_SIZE.width,
    height: savedHeight ? parseInt(savedHeight, 10) : DEFAULT_SIZE.height,
  };
};

function Canvas() {
  const tool = useSelector(ToolStore.selectors.selectActiveTool);
  const style = useSelector(ToolStore.selectors.selectToolStyle);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isResizingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [size, setSize] = useState(getInitialSize);

  // const saveCanvasState = () => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const dataURL = canvas.toDataURL();
  //     localStorage.setItem('canvasDrawing', dataURL);
  //   }
  // };

  useEffect(() => {
    localStorage.setItem('canvasWidth', size.width);
    localStorage.setItem('canvasHeight', size.height);
    const canvas = canvasRef.current;
    if (!canvas) return;
    // const ctx = canvas.getContext('2d');
    // const savedDrawing = localStorage.getItem('canvasDrawing');

    // if (savedDrawing) {
    //   const img = new Image();
    //   img.src = savedDrawing;
    //   img.onload = () => {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.drawImage(img, 0, 0, size.width, size.height);
    //   };
    // }
  }, [size]);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
    // saveCanvasState();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizingRef.current) return;
    const currentWidth = containerRef.current.clientWidth;
    const currentHeight = containerRef.current.clientHeight;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    const newWidth = currentWidth + deltaX;
    const newHeight = currentHeight + deltaY;
    if (newWidth > 100 && newHeight > 100) {
      setSize({
        width: newWidth,
        height: newHeight,
      });
      startPosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    // saveCanvasState();
  };

  const handlers = useCanvasDraw(canvasRef, {
    width: window.innerWidth,
    height: window.innerHeight,
    tool,
    style,
  });

  return (
    <section
      ref={containerRef}
      className="canvas-container"
      style={{
        width: size.width,
        height: size.height,
      }}
    >
      <canvas
        className="canvas-wrap"
        width={500}
        height={500}
        ref={canvasRef}
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
        onPointerLeave={handlers.onPointerLeave}
      />
      <div
        className="resize-handle bottom-right"
        onMouseDown={handleMouseDown}
      />
    </section>
  );
}

export default Canvas;
