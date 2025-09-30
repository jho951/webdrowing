/**
 * @file reset-canvas.js
 * @author YJH
 */

/**
 * @description 전달받은 캔버스를 초기화
 * @param {HTMLCanvasElement|React.RefObject<HTMLCanvasElement>} targetRef
 * @param {CanvasRenderingContext2D|React.RefObject<CanvasRenderingContext2D>} ctctxxRef
 * @example resetCanvas(canvasRef, ctxRef);
 */
function resetCanvas(targetRef, ctx) {
  if (!targetRef || !ctx) return;
  const canvas = targetRef?.current;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
export { resetCanvas };
