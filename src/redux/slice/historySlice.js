import { createSlice, createSelector } from '@reduxjs/toolkit';

const LIMIT = 10;

const initialState = {
  past: [],
  present: null,
  future: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushSnapshot(state, action) {
      const snap = action.payload;
      if (!snap) return;
      if (state.present) state.past.push(state.present);
      state.present = snap;
      state.future = [];
      if (state.past.length > LIMIT) {
        state.past.splice(0, state.past.length - LIMIT);
      }
    },
    undo(state) {
      if (!state.past.length) return;
      const prev = state.past.pop();
      if (state.present) state.future.unshift(state.present);
      state.present = prev;
    },
    redo(state) {
      if (!state.future.length) return;
      const next = state.future.shift();
      if (state.present) state.past.push(state.present);
      state.present = next;
    },
    resetHistory() {
      return { ...initialState };
    },
  },
});

export const { pushSnapshot, undo, redo, resetHistory } = historySlice.actions;
export default historySlice.reducer;

export const selectCurrentSnapshot = (state) => state.history.present;
export const canUndo = createSelector(
  (s) => s.history.past.length,
  (n) => n > 0
);
export const canRedo = createSelector(
  (s) => s.history.future.length,
  (n) => n > 0
);
