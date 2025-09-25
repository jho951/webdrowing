/**
 * @file reset-canvas.js
 * @author YJH
 * @description props를 통해 받은 캔버스를 모두 초기화
 * @param {*} ctx 캔버스에 적용된 요소 ref
 */
function clearCanvas(canvasRef, ctxRef) {
  const canvas = canvasRef.current;
  const ctx = ctxRef.current;
  if (!canvas || !ctxRef.current) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export { clearCanvas };
