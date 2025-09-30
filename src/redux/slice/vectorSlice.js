/**
 * @file vectorSlice.js
 * @author YJH
 */
import { createSlice } from '@reduxjs/toolkit';

/**
 * @description 도형, 텍스트, 이미지 관리
 */
const initialState = { shapes: [] };

const vectorSlice = createSlice({
  name: 'vector',
  initialState,
  reducers: {
    addShape(state, action) {
      state.shapes.push(action.payload);
    },
    updateShape(state, action) {
      const i = state.shapes.findIndex((s) => s.id === action.payload.id);
      if (i >= 0) state.shapes[i] = action.payload;
    },
  },
});

export const { addShape } = vectorSlice.actions;
export default vectorSlice.reducer;

// // src/redux/slice/vectorSlice.js
// import { createSlice, nanoid } from '@reduxjs/toolkit';

// const LIMIT = 50;

// const presentInit = {
//   shapes: [], // [{ id, type, ...style }]
//   selectedId: null, // 선택된 도형 id
// };

// const initialState = {
//   past: [],
//   present: presentInit,
//   future: [],
// };

// function commit(state, nextPresent) {
//   state.past.push(state.present);
//   if (state.past.length > LIMIT) state.past.shift();
//   state.present = nextPresent;
//   state.future = []; // 새 변경이 생기면 redo 스택 삭제
// }

// const vectorSlice = createSlice({
//   name: 'vector',
//   initialState,
//   reducers: {
//     addShape(state, { payload }) {
//       const id = payload.id ?? nanoid();
//       const next = {
//         ...state.present,
//         shapes: [...state.present.shapes, { ...payload, id }],
//         selectedId: id,
//       };
//       commit(state, next);
//     },

//     updateShape(state, { payload: { id, patch } }) {
//       const shapes = state.present.shapes.map((s) =>
//         s.id === id ? { ...s, ...patch } : s
//       );
//       commit(state, { ...state.present, shapes });
//     },

//     removeShape(state, { payload: id }) {
//       const shapes = state.present.shapes.filter((s) => s.id !== id);
//       const selectedId =
//         state.present.selectedId === id ? null : state.present.selectedId;
//       commit(state, { ...state.present, shapes, selectedId });
//     },

//     clearShapes(state) {
//       commit(state, { ...state.present, shapes: [], selectedId: null });
//     },

//     // 선택 변경은 기본적으로 히스토리 X (원하면 commit으로 바꿔도 됨)
//     selectShape(state, { payload: id }) {
//       state.present = { ...state.present, selectedId: id };
//     },

//     // ---- Undo / Redo ----
//     undoVector(state) {
//       if (!state.past.length) return;
//       state.future.unshift(state.present);
//       state.present = state.past.pop();
//     },
//     redoVector(state) {
//       if (!state.future.length) return;
//       state.past.push(state.present);
//       state.present = state.future.shift();
//     },
//   },
// });

// export const {
//   addShape,
//   updateShape,
//   removeShape,
//   clearShapes,
//   selectShape,
//   undoVector,
//   redoVector,
// } = vectorSlice.actions;

// // selectors
// export const selectShapes = (s) => s.vector.present.shapes;
// export const selectSelectedId = (s) => s.vector.present.selectedId;
// export const selectSelectedShape = (s) =>
//   s.vector.present.shapes.find((x) => x.id === s.vector.present.selectedId) ||
//   null;
// export const selectVectorCanUndo = (s) => s.vector.past.length > 0;
// export const selectVectorCanRedo = (s) => s.vector.future.length > 0;

// export default vectorSlice.reducer;
//
//
//
//
//
//
//
//
// type Base = { id, type, x, y, w, h, rot, opacity, locked, visible, z };
// // type: 'rect'|'ellipse'|'line'|'path'|'text'|'image'
// // text: { font, size, weight, align, content }
// // image: { src | blobUrl, naturalW, naturalH }
// { objects: Base[], order: id[] }
