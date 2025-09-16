import { useRef, useEffect, useState } from "react";
import drawUtils from "../util/DrawUtil";
import { DRAW_THEME } from "../../constant/drawTheme";
import './canvasDrawing.css';

function CanvasDrawing () {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const draw = drawUtils(ctx);

    const startDrawing = (e) => {
      setStartPos({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
      setIsDrawing(true);
    };

    const drawOnCanvas = (e) => {
      if (!isDrawing) return;

      const x = e.clientX - canvas.offsetLeft;
      const y = e.clientY - canvas.offsetTop;
      
    
      draw.clear();
      draw.rect({
        x: startPos.x,
        y: startPos.y,
        width: x - startPos.x,
        height: y - startPos.y,
        strokeStyle: DRAW_THEME.red,
        lineWidth: 2,
      });
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawOnCanvas);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", drawOnCanvas);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [isDrawing, startPos]);

  return <canvas className="canvas-wrap" ref={canvasRef} width={500} height={500}/>;
};

export default CanvasDrawing;
