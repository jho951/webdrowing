/**
 * @file drawSlice.ts
 * @author YJH
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Shape =
  | {
      id: import('crypto').UUID;
      type: 'rect' | 'circle';
      x: number;
      y: number;
      w: number;
      h: number;
      stroke?: string;
      strokeWidth?: number;
      fill: string;
    }
  | {
      id: import('crypto').UUID;
      type: 'line' | 'curve';
      x: number;
      y: number;
      x2: number;
      y2: number;
      stroke?: string;
      strokeWidth?: number;
    };

type VectorState = { shapes: Shape[] };

const initialState: VectorState = { shapes: [] };

/**
 * @description 도구 및 도형 관리 슬라이스
 */
const vectorSlice = createSlice({
  name: 'vector',
  initialState,
  reducers: {
    addShape(state, action: PayloadAction<Shape>) {
      state.shapes.push(action.payload);
    },
    updateShape(state, action: PayloadAction<Shape>) {
      const item = state.shapes.findIndex(
        (ele) => ele.id === action.payload.id
      );
      if (item >= 0) {
        state.shapes[item] = action.payload;
      }
    },
    removeShape(state, action: PayloadAction<String>) {
      state.shapes = state.shapes.filter((ele) => ele.id != action.payload);
    },
    replaceAll(state, action: PayloadAction<VectorState>) {
      return action.payload;
    },
    clear(state) {
      state.shapes = [];
    },
  },
});
export const { addShape, updateShape, removeShape, replaceAll, clear } =
  vectorSlice.actions;
export default vectorSlice.reducer;
