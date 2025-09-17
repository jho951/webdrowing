import { configureStore } from '@reduxjs/toolkit';
import ToolStore from '../slice/toolSlice';

const store = configureStore({
  reducer: {
    tool: ToolStore.reducer,
  },
});

export { store };
