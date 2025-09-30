/**
 * @file hooks/use-bitmap-history.js
 * @author YJH
 * @description ImageData 기반 undo/redo를 리액트 훅으로 제공
 *
 * 사용법:
 * const history = useBitmapHistory(canvasRef, ctxRef, { limit: 20, baseline: 'current' });
 * history.snapshot(); history.undo(); history.redo(); ...
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HISTORY } from '../constant/history';
import { resetCanvas } from '../util/reset-canvas';

export default function useBitmapHistory(
  canvasRef,
  ctxRef,
  {
    limit = HISTORY?.DEFAULT_LIMIT ?? 10,
    baseline = 'current',
    autoInit = true,
    sizeKey,
  } = {}
) {
  // 내부 상태 저장용 ref (리렌더 없이 변경 가능)
  const stateRef = useRef({
    canvas: null,
    ctx: null,
    stack: [],
    index: -1,
    limit: Number(limit) || 10,
  });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const width = useCallback(() => stateRef.current.canvas?.width ?? 0, []);
  const height = useCallback(() => stateRef.current.canvas?.height ?? 0, []);

  const recalcFlags = useCallback(() => {
    const s = stateRef.current;
    setCanUndo(s.index > 0);
    setCanRedo(s.index >= 0 && s.index < s.stack.length - 1);
  }, []);

  const clear = useCallback(() => {
    const s = stateRef.current;
    s.stack = [];
    s.index = -1;
    recalcFlags();
  }, [recalcFlags]);

  const drawImageData = useCallback((imgData) => {
    const { ctx } = stateRef.current;
    if (!ctx || !imgData) return;
    ctx.save();
    // 변환 초기화 (DPR 스케일 등 무관하게 절대 좌표로 복원)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
  }, []);

  const takeImageData = useCallback(() => {
    const s = stateRef.current;
    const w = width();
    const h = height();
    if (!s.ctx || !w || !h) return null;
    try {
      return s.ctx.getImageData(0, 0, w, h);
    } catch {
      return null;
    }
  }, [width, height]);

  const makeEmptyImageData = useCallback(() => {
    const s = stateRef.current;
    const w = width();
    const h = height();
    if (!s.ctx || !w || !h) return null;
    return s.ctx.createImageData(w, h); // 완전 투명 빈 스냅샷
  }, [width, height]);

  /**
   * 최초 baseline 스냅샷 쌓기
   * @param {{baseline?: Baseline, limit?: number}} opt
   */
  const init = useCallback(
    (opt = {}) => {
      const s = stateRef.current;
      s.canvas = canvasRef?.current ?? null;
      s.ctx = ctxRef?.current ?? null;
      s.limit = Number(opt.limit ?? limit) || s.limit;

      clear();

      const baseMode = opt.baseline ?? baseline; // 'current' | 'empty'
      const base =
        baseMode === 'empty' ? makeEmptyImageData() : takeImageData();

      if (base) {
        s.stack.push(base);
        s.index = 0;
      }

      recalcFlags();
    },
    [
      canvasRef,
      ctxRef,
      baseline,
      limit,
      clear,
      takeImageData,
      makeEmptyImageData,
      recalcFlags,
    ]
  );

  const snapshot = useCallback(() => {
    const s = stateRef.current;
    if (!s.canvas || !s.ctx) return;

    const snap = takeImageData();
    if (!snap) return;

    // 현재 인덱스 뒤로는 제거하고 새 스냅샷 push
    s.stack.splice(s.index + 1);
    s.stack.push(snap);

    // 링버퍼 처리
    if (s.stack.length > s.limit) {
      s.stack.shift();
    }

    s.index = s.stack.length - 1;
    recalcFlags();
  }, [takeImageData, recalcFlags]);

  const canUndoFn = useCallback(() => {
    const s = stateRef.current;
    return s.index > 0;
  }, []);

  const canRedoFn = useCallback(() => {
    const s = stateRef.current;
    return s.index >= 0 && s.index < s.stack.length - 1;
  }, []);

  const undo = useCallback(() => {
    const s = stateRef.current;
    if (!canUndoFn()) return;
    s.index -= 1;
    drawImageData(s.stack[s.index]);
    recalcFlags();
  }, [canUndoFn, drawImageData, recalcFlags]);

  const redo = useCallback(() => {
    const s = stateRef.current;
    if (!canRedoFn()) return;
    s.index += 1;
    drawImageData(s.stack[s.index]);
    recalcFlags();
  }, [canRedoFn, drawImageData, recalcFlags]);

  const resetToEmpty = useCallback(() => {
    const s = stateRef.current;
    if (!s.ctx || !s.canvas) return;

    // 실제 캔버스 지우기 (DPR 고려한 resetCanvas 유틸 사용)
    resetCanvas({ current: s.canvas }, s.ctx);

    clear();

    const empty = makeEmptyImageData();
    if (empty) {
      s.stack.push(empty);
      s.index = 0;
    }
    recalcFlags();
  }, [clear, makeEmptyImageData, recalcFlags]);

  // autoInit: ref가 유효해지고 sizeKey가 바뀔 때마다 재초기화
  useEffect(() => {
    if (!autoInit) return;
    const c = canvasRef?.current;
    const x = ctxRef?.current;
    if (!c || !x) return;
    init({ baseline, limit });
  }, [autoInit, canvasRef, ctxRef, init, baseline, limit, sizeKey]);

  // 디버그/외부 필요시 index,length 노출
  const meta = useMemo(() => {
    const s = stateRef.current;
    return { index: s.index, length: s.stack.length, limit: s.limit };
  }, [canUndo, canRedo, sizeKey]); // 대략적 추적용

  return {
    // actions
    init,
    snapshot,
    undo,
    redo,
    resetToEmpty,
    clear,
    // state
    canUndo,
    canRedo,
    // helpers
    canUndoFn,
    canRedoFn,
    meta,
  };
}
