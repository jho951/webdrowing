import { useEffect, useRef, useState } from 'react';

const useCanvasResize = (initialSize) => {
  const [size, setSize] = useState(initialSize);
  const containerRef = useRef(null);

  useEffect(() => {
    const handle = containerRef.current.querySelector('.resize-handle');
    if (!handle) return;

    let isResize = false;
    let startX;
    let startY;
    let startWidth;
    let startHeight;

    const onMouseDown = (e) => {
      isResize = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = size.width;
      startHeight = size.height;

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isResize) return;

      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      setSize({
        width: Math.max(100, newWidth),
        height: Math.max(100, newHeight),
      });
    };

    const onMouseUp = () => {
      isResize = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    handle.addEventListener('mousedown', onMouseDown);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [size]);

  return { size, containerRef };
};

export { useCanvasResize };
