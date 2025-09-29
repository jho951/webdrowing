/**
 * @file reset-canvas.js
 * @author YJH
 * @description 전달받은 캔버스를 모두 초기화
 * @param {HTMLCanvasElement|React.RefObject<HTMLCanvasElement>} canvasRef
 * @param {CanvasRenderingContext2D|React.RefObject<CanvasRenderingContext2D>} ctxRef
 */
function resetCanvas(targetRef, ctx) {
  const canvas = targetRef?.current;
  if (!canvas || !ctx) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
export { resetCanvas };
