/**
 * @file reset-canvas.js
 * @author YJH
 * @description 전달받은 캔버스를 모두 초기화
 * @param {HTMLCanvasElement|React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {CanvasRenderingContext2D|React.RefObject<CanvasRenderingContext2D>} ctxRef
 */
function resetCanvas(canvasRef, ctxRef) {
  const canvas =
    canvasRef && 'current' in canvasRef ? canvasRef.current : canvasRef;
  const ctx = ctxRef && 'current' in ctxRef ? ctxRef.current : ctxRef;
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export { resetCanvas };
