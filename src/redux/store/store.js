/**
 * @file store.js
 * @author YJH
 */
import { configureStore } from '@reduxjs/toolkit';
import drawReducer from '../slice/drawSlice';
import imageReducer from '../slice/imageSlice';
import styleReducer from '../slice/styleSlice';

/**
 * @description 리덕스 스토어
 */
const store = configureStore({
  reducer: {
    draw: drawReducer,
    image: imageReducer,
    style: styleReducer,
  },
});

export { store };
