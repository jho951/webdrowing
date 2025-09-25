/**
 * @file store.js
 * @author YJH
 */
import { configureStore } from '@reduxjs/toolkit';

import toolReducer from '../slice/toolSlice';
import shapeReducer from '../slice/shapeSlice';
import colorReducer from '../slice/colorSlice';
import widthReducer from '../slice/widthSlice';
import imageReducer from '../slice/imageSlice';
import vectorReducer from '../slice/vectorSlice';

/**
 * @description 리덕스 스토어
 */
const store = configureStore({
  reducer: {
    tool: toolReducer,
    shape: shapeReducer,
    color: colorReducer,
    width: widthReducer,
    image: imageReducer,
    vector: vectorReducer,
  },
});

export { store };
