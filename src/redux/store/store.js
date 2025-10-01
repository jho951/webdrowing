import { configureStore } from '@reduxjs/toolkit';
import modeReducer from '../slice/modeSlice';
import toolReducer from '../slice/toolSlice';
import styleReducer from '../slice/styleSlice';
import bitmapReducer from '../slice/bitmapSlice';
import historyReducer from '../slice/historySlice';
import textReducer from '../slice/textSlice';
import selectReducer from '../slice/selectSlice';
import imageReducer from '../slice/imageSlice';
import sizeReducer from '../slice/sizeSlice';
import shapeReducer from '../slice/shapeSlice';

import historyVectorReducer from '../slice/vectorSlice';
import { historyVectorMiddleware } from '../middleware/historymiddleware';

const store = configureStore({
    reducer: {
        mode: modeReducer,
        tool: toolReducer,
        style: styleReducer,
        bitmap: bitmapReducer,
        history: historyReducer,
        text: textReducer,
        select: selectReducer,
        image: imageReducer,
        size: sizeReducer,
        shape: shapeReducer,
        historyVector: historyVectorReducer,
    },
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false }).concat(
            historyVectorMiddleware
        ),
});

export default store;
