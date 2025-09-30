/**
 * @file tppl.js
 * @author YJH
 * @description 비트맵 도구 상수
 */

import { deepFreeze } from '../util/deep-freeze';
import { getId } from '../util/get-id';

const TOOL_TYPE = 'tool';

/**
 * @description 초기값 (도구)
 */
const INITIAL_TOOL = deepFreeze({
  id: getId(),
  type: TOOL_TYPE,
  mode: TOOL_TYPE,
  payload: 'brush',
  name: '붓',
  icon: 'brush',
  shortcut: 'B',
  cursor: 'crosshair',
});

/**
 * @description 옵션 (도구)
 */
const TOOLS = deepFreeze([
  INITIAL_TOOL,
  {
    id: getId(),
    type: TOOL_TYPE,
    mode: TOOL_TYPE,
    payload: 'eraser',
    name: '지우개',
    icon: 'eraser',
    shortcut: 'E',
    cursor: 'crosshair',
  },
]);

const TOOLS_VALUE = TOOLS.flat().map((item) => item.payload);

const IsTool = (tool) => {
  return TOOLS.some((ele) => ele === tool.payload);
};

const selectActiveTool = (s) => {
  if (s.tool.mode !== TOOL.TOOL_TYPE) return null;
  const toolValue = s.tool.value;
  return TOOLS.find((t) => t.payload === toolValue) || null;
};

export const TOOL = {
  INITIAL_TOOL,
  TOOLS,
  TOOLS_VALUE,
  TOOL_TYPE,
  selectActiveTool,
};
