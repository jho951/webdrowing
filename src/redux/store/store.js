/**
 * @file store.js
 * @author YJH
 */
import { configureStore } from '@reduxjs/toolkit';

import tool from '../slice/toolSlice';
import shape from '../slice/shpeSlice';
import text from '../slice/textSlice';
import image from '../slice/imageSlice';
import vector from '../slice/vectorSlice';
import history from '../slice/historySlice';
import selection from '../slice/selectSlice';

import { historyOrchestrator } from '../middleware/middleware';

/**
 * @description 리덕스 스토어
 */
const store = configureStore({
  reducer: { tool, shape, vector, text, image, selection, history },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(historyOrchestrator),
});

export { store };
