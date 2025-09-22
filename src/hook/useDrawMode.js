/**
 * @file useDrawMode.js
 * @author YJH
 */
import { createSelector } from '@reduxjs/toolkit';

const getTool = (state) => state.tool.activeTool;
const getShape = (state) => state.shape.activeShape;
const getColor = (state) => state.color.activeColor;
const getWidth = (state) => state.width.activeWidth;

/**
 *
 */
const selectDrawMode = createSelector(
  [getTool, getShape, getColor, getWidth],
  (tool, shape, color, width) => ({ tool, shape, color, width })
);

export { selectDrawMode, getTool, getShape, getColor, getWidth };
