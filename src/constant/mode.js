import { deepFreeze } from '../util/deep-freeze';
import { TOOL } from './tool';

const GLOBAL_NULL = 'idle';

const MODES = deepFreeze([
  TOOL.TOOL_TYPE,
  'shape',
  'text',
  'select',
  'image',
  GLOBAL_NULL,
]);

const isMode = (mode) => MODE.some((ele) => ele === mode);

export const MODE = { MODES, isMode, GLOBAL_NULL };
