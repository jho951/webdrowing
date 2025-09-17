/**
 * @file store.js
 * @author YJH
 */
// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import drawReducer from '../slice/drawSlice';
import styleReducer from '../slice/styleSlice';
import toolRegistryReducer from '../slice/toolSlice';

const store = configureStore({
  reducer: {
    draw: drawReducer,
    style: styleReducer,
    toolRegistry: toolRegistryReducer,
  },
});

export { store };
