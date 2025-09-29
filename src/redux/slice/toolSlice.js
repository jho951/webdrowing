import { createSlice } from '@reduxjs/toolkit';
import { DRAW } from '../../constant/draw';

const initialState = { active: DRAW.TOOL.INITIAL_TOOL.value };

const toolSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    setTool(state, action) {
      const v = String(action.payload);
      if (DRAW.isAllowedValue(v)) state.active = v;
    },
    resetTool(state) {
      state.active = DRAW.TOOL.INITIAL_TOOL.value;
    },
  },
});

export const { setTool, resetTool } = toolSlice.actions;
export default toolSlice.reducer;
