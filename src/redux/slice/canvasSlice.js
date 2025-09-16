import { createSlice } from '@reduxjs/toolkit';
import { FLOAT_DEFAULT, INITIAL_TOOL_STATE } from '../../constant/floatDefault';

const initialState = INITIAL_TOOL_STATE();

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {

}});

export const { setColor, setLineWidth, setOpacity, setTool } = canvasSlice.actions;
export default canvasSlice.reducer;
