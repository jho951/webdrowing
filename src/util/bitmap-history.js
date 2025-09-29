/**
 * @file bitmap-history.js
 * @author YJH
 */

import { HISTORY } from '../constant/history';

/**
 * @desciption 비트맵 캔버스 히스토리 스택 (undo/redo)
 * - createImageBitmap 미지원 대비 데이터URL 폴백 포함
 * - init(canvas, ctx, limit) 시 limit 정상 반영 (스코프 버그 수정)
 * - HISTORY 상수 오타 수정(HISYORY -> HISTORY). 상수 없을 경우 10으로 기본값 처리
 * @param {*} limitDefault
 * @returns
 */
function makeBitmapHistory(limitDefault = HISTORY.DEFAULT_LIMIT) {
  let canvas = null;
  let ctx = null;
  let stack = [];
  let index = -1;
  let limit = limitDefault;

  const clear = () => {
    stack = [];
    index = -1;
  };

  const init = (canvasEl, ctx2d, limitArg) => {
    canvas = canvasEl || null;
    ctx = ctx2d || null;
    limit = Number.isFinite(limitArg) ? Number(limitArg) : limitDefault;
    clear();
  };

  const _saveFromDataURL = async () => {
    const url = canvas.toDataURL('image/png');
    const img = new Image();
    img.src = url;
    await img.decode?.();
    return img;
  };

  const _makeSnapshotBitmap = async () => {
    if (typeof createImageBitmap === 'function') {
      return await createImageBitmap(canvas);
    }
    return _saveFromDataURL();
  };

  const snapshot = async () => {
    if (!canvas) return;
    const bmp = await _makeSnapshotBitmap();
    stack.splice(index + 1);
    stack.push(bmp);
    if (stack.length > limit) stack.shift();
    index = stack.length - 1;
  };

  const canUndo = () => index > 0;
  const canRedo = () => index >= 0 && index < stack.length - 1;

  const _draw = (bmp) => {
    if (!ctx || !canvas || !bmp) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0);
  };

  const undo = () => {
    if (!canUndo()) return;
    index -= 1;
    _draw(stack[index]);
  };

  const redo = () => {
    if (!canRedo()) return;
    index += 1;
    _draw(stack[index]);
  };

  const resetToEmpty = () => {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clear();
  };

  return { init, snapshot, canUndo, canRedo, undo, redo, resetToEmpty };
}

let _instance = null;
function bitmapHistory(limitDefault) {
  if (!_instance) _instance = makeBitmapHistory(limitDefault);
  return _instance;
}

export { bitmapHistory };
