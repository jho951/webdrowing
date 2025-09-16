import { useRef } from 'react';
import { useSelector } from 'react-redux';
// (A) ToolStore 사용 시
// import ToolStore from '@/store/toolSlice';
// const tool = useSelector(ToolStore.selectors.selectActiveTool);
// const style = useSelector(ToolStore.selectors.selectToolStyle);

// (B) 간단히 바로 접근
const selectTool = (s) => s.tool.activeTool;
const selectStyle = (s) => s.tool.style;

import { useCanvasDraw } from '../../hook/useCanvasDraw';
import './canvas.css';

function Canvas() {
  const canvasRef = useRef(null);
  const tool = useSelector(selectTool); // 'brush' | 'eraser' | ...
  const style = useSelector(selectStyle); // { color, width }

  const handlers = useCanvasDraw(canvasRef, {
    width: 800,
    height: 500,
    tool,
    style,
  });

  return (
    <canvas
      className="canvas-wrap"
      ref={canvasRef}
      // Pointer 이벤트로 통일 (모바일/펜 대응)
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerLeave={handlers.onPointerLeave}
    />
  );
}

export default Canvas;
