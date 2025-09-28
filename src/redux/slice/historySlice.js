import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  stack: [],
  index: -1,  
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // 현재 상태 스냅샷을 푸시 (미래분기 삭제 후 push)
    pushSnapshot(state, action) {
      const snap = action.payload; // { vector, text, image, selection }
      if (state.index < state.stack.length - 1) {
        state.stack = state.stack.slice(0, state.index + 1);
      }
      state.stack.push(snap);
      state.index = state.stack.length - 1;
    },
    undo(state) {
      if (state.index > 0) state.index -= 1;
    },
    redo(state) {
      if (state.index < state.stack.length - 1) state.index += 1;
    },
    // 필요 시 히스토리 초기화
    clearHistory(state) {
      state.stack = [];
      state.index = -1;
    },
  },
});

export const { pushSnapshot, undo, redo, clearHistory } = historySlice.actions;

// 미들웨어에서 쓰는 셀렉터
export const selectCurrentSnapshot = (rootState) => {
  const h = rootState.history;
  if (!h || h.index < 0 || h.index >= h.stack.length) return null;
  return h.stack[h.index];
};

export default historySlice.reducer;
