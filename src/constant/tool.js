/**
 * @file constant/tool.js
 * @description 비트맵 도구(붓/지우개) 카탈로그
 */
import { deepFreeze } from '../util/deep-freeze';
import { getId } from '../util/get-id';

const TOOL_TYPE = 'tool';

// 초기 도구(붓)
const INITIAL_TOOL = {
    id: getId(),
    type: TOOL_TYPE,
    mode: TOOL_TYPE,
    payload: 'brush',
    name: '붓',
    icon: 'brush',
    shortcut: 'B',
    cursor: 'crosshair',
};

// 도구 목록
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

// payload → item 매핑 (빠른 조회용)
const TOOLS_VALUE = deepFreeze(
    TOOLS.reduce((acc, it) => {
        acc[it.payload] = it;
        return acc;
    }, {})
);

// 유효한 도구 payload 인가?
const isToolPayload = (payload) => TOOLS.some((it) => it.payload === payload);

// 도구 객체 찾기
const findToolByPayload = (payload) =>
    TOOLS.find((it) => it.payload === payload) || null;

export const TOOL = {
    TOOL_TYPE,
    INITIAL_TOOL,
    TOOLS,
    TOOLS_VALUE,
    isToolPayload,
    findToolByPayload,
};
