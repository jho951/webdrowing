import { createSlice } from "@reduxjs/toolkit";
import { TOOL_INITIAL_STATE } from "../../constant/defaultState";

const initialState = TOOL_INITIAL_STATE();

const toolSlice = createSlice({
  name: "tool",
  initialState,
  reducers: {
    setToolType(state, action) {
      state.type = action.payload;
    }
}
});


export default toolSlice;
