/**
 * @file store.js
 * @author YJH
 */

import { configureStore } from '@reduxjs/toolkit';

import tool from '../slice/toolSlice';
import shape from '../slice/shapeSlice';
import vector from '../slice/vectorSlice';
import selection from '../slice/selectSlice';
import history from '../slice/historySlice';

import { historyOrchestrator } from '../middleware/middleware';

export const store = configureStore({
  reducer: { tool, shape, vector, selection, history },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(historyOrchestrator),
});

export default store;
