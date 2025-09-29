import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stack: [],
  index: -1,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushSnapshot(state, action) {
      const snap = action.payload;
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

    clearHistory(state) {
      state.stack = [];
      state.index = -1;
    },
  },
});

export const { pushSnapshot, undo, redo, clearHistory } = historySlice.actions;

export const selectCurrentSnapshot = (rootState) => {
  const h = rootState.history;
  if (!h || h.index < 0 || h.index >= h.stack.length) return null;
  return h.stack[h.index];
};

export default historySlice.reducer;
