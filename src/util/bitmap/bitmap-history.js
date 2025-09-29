/**
 * @file bitmap-history.ts
 * @author YJH
 */

/**
 * @description 비트맵 기반 데이터 스택 저장 유틸
 * @param limitDefault
 * @returns
 */
function bitmapHistory(limitDefault) {
  let canvas = null;
  let ctx = null;
  let stack = [];
  let index = -1;
  let limit = limitDefault;

  const init = (canvasRef, ctxRef, limit) => {
    canvas = canvasRef;
    ctx = ctxRef;
    limit = 10;
    stack = [];
    index = -1;
  };

  const snapshot = async () => {
    if (!canvas) return;
    const bmp = await createImageBitmap(canvas);
    stack.splice(index + 1);
    stack.push(bmp);
    if (stack.length > limit) stack.shift();
    index = stack.length - 1;
  };

  const canUndo = () => index > 0;
  const canRedo = () => index < stack.length - 1;

  const undo = () => {
    if (!ctx || !canvas || !canUndo()) return;
    index -= 1;
    const bmp = stack[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0);
  };

  const redo = () => {
    if (!ctx || !canvas || !canRedo()) return;
    index += 1;
    const bmp = stack[index];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0);
  };

  return { init, snapshot, canUndo, canRedo, undo, redo };
}

export { bitmapHistory };
