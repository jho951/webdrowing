/**
 * @file historySlice.ts
 * @author YJH
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store/store';

type Snapshot = {
  vector: RootState['vector'];
  text: RootState['text'];
  image: RootState['image'];
  selection: RootState['selection'];
};

type HistoryState = { stack: Snapshot[]; index: number; limit: number };

const initialState: HistoryState = { stack: [], index: -1, limit: 50 };

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    pushSnapshot(state, action: PayloadAction<Snapshot>) {
      state.stack.splice(state.index + 1);
      state.stack.push(action.payload);
      if (state.stack.length > state.limit) state.stack.shift();
      state.index = state.stack.length - 1;
    },
    undo(state) {
      if (state.index > 0) state.index -= 1;
    },
    redo(state) {
      if (state.index < state.stack.length - 1) state.index += 1;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.max(1, action.payload);
    },
  },
});

export const selectCurrentSnapshot = (st: RootState) =>
  st.history.stack[st.history.index] ?? null;

export const canUndo = (st: RootState) => st.history.index > 0;
export const canRedo = (st: RootState) =>
  st.history.index < st.history.stack.length - 1;

export const { pushSnapshot, undo, redo, setLimit } = historySlice.actions;
export default historySlice.reducer;
