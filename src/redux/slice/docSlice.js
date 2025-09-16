import { createSlice, nanoid } from '@reduxjs/toolkit';
import { DRAW_DEFAULT, makeInitialDocState } from '../constants/defaultState.js';

// 내부 유틸
const META_BYTES = 300;
const isTypedArray = (x) => ArrayBuffer.isView(x) && !(x instanceof DataView);

function estimateBytes(points, mode = 'float32') {
  if (isTypedArray(points)) return META_BYTES + points.byteLength;
  const pCount = Array.isArray(points) ? points.length / 2 : 0; // [x,y,...] 기준
  const perPoint = mode === 'uint16' ? 4 : mode === 'float32' ? 8 : 56; // array 보수치 56
  return META_BYTES + perPoint * pCount;
}

const initialState = makeInitialDocState();

const docSlice = createSlice({
  name: 'doc',
  initialState,
  reducers: {
    // pointerup 시 커밋: { tool, style, points(Float32Array|Uint16Array|number[]) }
    addStroke(s, a) {
      const st = a.payload ?? {};
      const bytes = estimateBytes(st.points, s.history.storeMode);
      s.strokes.push({ ...st, id: st.id ?? nanoid(), _bytes: bytes });
      s.redoStack = [];
      s.history.totalBytes += bytes;

      // 1) 메모리 예산 우선 소거
      const budget = (s.history.budgetMB ?? DRAW_DEFAULT.HISTORY.BUDGET_MB) * 1024 * 1024;
      while (s.history.totalBytes > budget && s.strokes.length) {
        const old = s.strokes.shift();
        s.history.totalBytes -= old?._bytes || 0;
      }
      // 2) 개수 퓨즈(옵션)
      if (s.history.maxCount && s.strokes.length > s.history.maxCount) {
        const old = s.strokes.shift();
        s.history.totalBytes -= old?._bytes || 0;
      }
    },

    undo(s) {
      if (!s.strokes.length) return;
      const last = s.strokes.pop();
      s.redoStack.push(last);
      s.history.totalBytes -= last?._bytes || 0;
    },

    redo(s) {
      if (!s.redoStack.length) return;
      const st = s.redoStack.pop();
      s.strokes.push(st);
      s.history.totalBytes += st?._bytes || 0;
    },

    clear(s) {
      s.strokes = [];
      s.redoStack = [];
      s.history.totalBytes = 0;
    },

    // 히스토리 정책 변경
    setHistoryBudgetMB(s, a) { s.history.budgetMB = a.payload; },
    setHistoryMaxCount(s, a) { s.history.maxCount = a.payload; },
    setStoreMode(s, a) { s.history.storeMode = a.payload; }, // 재인코딩은 별도 처리

    // 외부에서 문서 통째로 로드할 때
    replaceDocument(s, a) {
      const { strokes = [], budgetMB = s.history.budgetMB, maxCount = s.history.maxCount } = a.payload || {};
      s.strokes = [];
      s.redoStack = [];
      s.history.totalBytes = 0;
      s.history.budgetMB = budgetMB;
      s.history.maxCount = maxCount;
      for (const st of strokes) {
        const b = estimateBytes(st.points, s.history.storeMode);
        s.strokes.push({ ...st, _bytes: b, id: st.id ?? nanoid() });
        s.history.totalBytes += b;
      }
    },
  },
});

export const {
  addStroke, undo, redo, clear,
  setHistoryBudgetMB, setHistoryMaxCount, setStoreMode, replaceDocument,
} = docSlice.actions;

export const selectStrokes = (st) => st.doc.strokes;
export const selectCanUndo = (st) => st.doc.strokes.length > 0;
export const selectCanRedo = (st) => st.doc.redoStack.length > 0;

export default docSlice.reducer;
