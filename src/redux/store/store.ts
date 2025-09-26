/**
 * @file store.ts
 * @author YJH
 */
import { configureStore } from '@reduxjs/toolkit';

import tool from '@/redux/slice/toolSlice';
import text from '@/redux/slice/textSlice';
import image from '@/redux/slice/imageSlice';
import vector from '@/redux/slice/vectorSlice';
import history from '@/redux/slice/historySlice';
import selection from '@/redux/slice/selectSlice';

import { historyOrchestrator } from '@/redux/middleware/middleware';

/**
 * @description 리덕스 스토어
 */
const store = configureStore({
  reducer: { tool, vector, text, image, selection, history },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(historyOrchestrator),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
