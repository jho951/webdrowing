import { DRAW } from './draw.js';
import { STYLE } from './style.js';
import { VIEW } from './view.js';
import { SIZE } from './size.js';
import { HISTORY } from './history.js';

/**
 * 초기 Tool 상태 팩토리
 */
function makeInitialToolState(opts = {}) {
  return {
    activeTool: opts.defaultTool ?? DRAW.active.value,
    style: {
      color: STYLE.activeColor.value,
      width: STYLE.activeWidth.value,
    },
    coordMode: HISTORY.MODE,
  };
}

/**
 * 초기 View 상태 팩토리
 */
function makeInitialViewState() {
  return {
    scale: VIEW.SCALE,
    rotate: VIEW.ROTATE,
  };
}

/**
 * 초기 Doc/History 상태 팩토리
 */
function makeInitialDocState() {
  return {
    strokes: [],
    redoStack: [],
    history: {
      budgetMB: HISTORY.BUDGET_MB,
      maxCount: HISTORY.MAX_COUNT,
      storeMode: HISTORY.MODE,
      totalBytes: 0,
    },
  };
}

const DefaultState = Object.freeze({
  DRAW,
  STYLE,
  VIEW,
  SIZE,
  HISTORY,
  makeInitialToolState,
  makeInitialViewState,
  makeInitialDocState,
});

export default DefaultState;
