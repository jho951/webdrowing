/**
 * @file bitmap-history.js
 * @author YJH
 * @description 간단/동기 버전: ImageData 기반 undo/redo
 */

import { HISTORY } from '../constant/history';
import { resetCanvas } from './reset-canvas';

function makeBitmapHistory(limitDefault = HISTORY.DEFAULT_LIMIT) {
  const state = {
    ...HISTORY.STATE,
    stack: [],
    limit: HISTORY.DEFAULT_LIMIT, 
  };

  /**
   * init: 최초 baseline 스냅샷을 stack[0]에 기록 (current|empty)
   */
  const init = (canvasRef, ctxRef, limitArg, options = {}) => {
    state.canvas = canvasRef;
    state.ctx = ctxRef;
    state.limit = Number.isFinite(limitArg) ? Number(limitArg) : limitDefault;

    clear();

    const baseline = options?.baseline === 'empty' ? 'empty' : 'current';
    const base =
      baseline === 'empty' ? _makeEmptyImageData() : _takeImageData();

    if (base) {
      state.stack.push(base);
      state.index = 0;
    }
  };


  const _width = () => state.canvas?.width ?? 0;
  const _height = () => state.canvas?.height ?? 0;

  const clear = () => {
    state.stack = [];
    state.index = -1;
  };


  const _takeImageData = () => {
    const { ctx } = state;
    const w = _width(), h = _height();
    if (!ctx || !w || !h) return null;
    try {
      return ctx.getImageData(0, 0, w, h);
    } catch {
      return null; 
    }
  };

  const _makeEmptyImageData = () => {
    const { ctx } = state;
    const w = _width(), h = _height();
    if (!ctx || !w || !h) return null;
    return ctx.createImageData(w, h); // 완전 투명한 빈 스냅샷
  };

  const _draw = (imgData) => {
    const { ctx } = state;
    if (!ctx || !imgData) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 변환 초기화
    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
  };


  const snapshot = () => {
    if (!state.canvas) return;
    const snap = _takeImageData();
    if (!snap) return;
    state.stack.splice(state.index + 1);
    state.stack.push(snap);
    if (state.stack.length > state.limit) {
      state.stack.shift();
    }
    state.index = state.stack.length - 1;
  };

  const canUndo = () => state.index > 0;
  const canRedo = () => state.index >= 0 && state.index < state.stack.length - 1;

  const undo = () => {
    if (!canUndo()) return;
    state.index -= 1;
    _draw(state.stack[state.index]);
  };

  const redo = () => {
    if (!canRedo()) return;
    state.index += 1;
    _draw(state.stack[state.index]);
  };

  /**
   * resetToEmpty: 캔버스를 비우고, 그 빈 상태를 새로운 baseline으로 설정
   */
  const resetToEmpty = () => {
    const { ctx, canvas } = state;
    if (!ctx || !canvas) return;

    resetCanvas({ current: canvas }, ctx); // 실제 캔버스 지우기
    clear();

    const empty = _makeEmptyImageData();
    if (empty) {
      state.stack.push(empty);
      state.index = 0;
    }
  };

  return { init, snapshot, canUndo, canRedo, undo, redo, resetToEmpty };
}

let _instance = null;
function bitmapHistory(limitDefault) {
  if (!_instance) _instance = makeBitmapHistory(limitDefault);
  return _instance;
}

export { bitmapHistory };
