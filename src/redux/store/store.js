import { configureStore } from '@reduxjs/toolkit';
import ToolStore from '../slice/toolSlice';

export const store = configureStore({
  reducer: {
    tool: ToolStore.reducer,
  },
});
