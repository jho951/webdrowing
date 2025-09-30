/**
 * @file constant/mode.js
 * @description 전역 모드 상수
 */
import { deepFreeze } from '../util/deep-freeze';

const INITIAL_MODE = 'tool';

// 전역 모드 목록
const MODES = deepFreeze([
    INITIAL_MODE,
    'shape',
    'text',
    'select',
    'image',
    'idle',
]);

// 전역 null 대체값 (비활성 상태를 의미) — 슬라이스에서 사용 중
const GLOBAL_NULL = 'idle';

// 유효 모드인지 검사
const isMode = (mode) => MODES.some((m) => m === mode);

// 유효하면 그대로, 아니면 GLOBAL_NULL 반환
const getMode = (mode) => (isMode(mode) ? mode : GLOBAL_NULL);

export const MODE = {
    INITIAL_MODE,
    MODES,
    GLOBAL_NULL,
    isMode,
    getMode,
};
