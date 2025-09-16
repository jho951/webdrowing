import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    tool, view, docs, section   
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {ignoredPaths:['docs.strokes','docs.redoStack','docs.undoStack']},
    ignoredPaths:['payload.points']
  }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
