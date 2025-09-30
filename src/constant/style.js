/**
 * @file constant/style.js
 * @author YJH
 * @description 색상/선두께/배율/회전 불변 상수
 */
import { deepFreeze } from '../util/deep-freeze';

const STYLE_TYPE = 'style';

const pct = (v) => `${Math.round(v * 100)}%`;

/**
 * 색상
 */
const INITIAL_COLOR = {
    type: 'color',
    value: '#000000',
    label: '검정',
    icon: 'black',
};

const ALLOWED_COLOR = deepFreeze([
    INITIAL_COLOR,
    { type: 'color', value: '#FFFFFF', label: '흰색', icon: 'white' },
    { type: 'color', value: '#FF0000', label: '빨강', icon: 'red' },
    { type: 'color', value: '#0000FF', label: '파랑', icon: 'blue' },
    { type: 'color', value: '#00FF00', label: '초록', icon: 'green' },
    { type: 'color', value: '#FFFF00', label: '노랑', icon: 'yellow' },
]);

/**
 * 선 굵기
 */
const INITIAL_WIDTH = {
    type: 'width',
    value: 3,
    label: '3px',
    icon: '3px',
};

const ALLOWED_WIDTH = deepFreeze([
    { type: 'width', value: 9, label: '9px', icon: '9px' },
    { type: 'width', value: 7, label: '7px', icon: '7px' },
    { type: 'width', value: 5, label: '5px', icon: '5px' },
    INITIAL_WIDTH,
    { type: 'width', value: 1, label: '1px', icon: '1px' },
]);

/**
 * 배율(줌 프리셋)
 */
const INITIAL_SCALE = {
    type: 'scale',
    value: 1.0,
    label: `${Math.round(1 * 100)}%`,
    icon: '100%',
};

const ALLOWED_SCALE = deepFreeze([
    {
        type: 'scale',
        value: 0.25,
        label: `${Math.round(0.25 * 100)}%`,
        icon: '25%',
    },
    {
        type: 'scale',
        value: 0.5,
        label: `${Math.round(0.5 * 100)}%`,
        icon: '50%',
    },
    {
        type: 'scale',
        value: 0.75,
        label: `${Math.round(0.75 * 100)}%`,
        icon: '75%',
    },
    INITIAL_SCALE,
    {
        type: 'scale',
        value: 1.25,
        label: `${Math.round(1.25 * 100)}%`,
        icon: '125%',
    },
    {
        type: 'scale',
        value: 1.5,
        label: `${Math.round(1.5 * 100)}%`,
        icon: '150%',
    },
    {
        type: 'scale',
        value: 1.75,
        label: `${Math.round(1.75 * 100)}%`,
        icon: '175%',
    },
    {
        type: 'scale',
        value: 2.0,
        label: `${Math.round(2 * 100)}%`,
        icon: '200%',
    },
]);

/**
 * 회전 스텝(도구 아님: 뷰/트랜스폼 프리셋)
 */
const INITIAL_ROTATE = {
    type: 'rotate',
    value: 0,
    label: '0°',
    icon: '0deg',
};

const ALLOWED_ROTATE = deepFreeze([
    INITIAL_ROTATE,
    { type: 'rotate', value: 15, label: '15°', icon: '15deg' },
    { type: 'rotate', value: 30, label: '30°', icon: '30deg' },
    { type: 'rotate', value: 45, label: '45°', icon: '45deg' },
    { type: 'rotate', value: 90, label: '90°', icon: '90deg' },
]);

export const STYLE = {
    STYLE_TYPE,
    INITIAL_COLOR,
    ALLOWED_COLOR,
    INITIAL_WIDTH,
    ALLOWED_WIDTH,
    INITIAL_SCALE,
    ALLOWED_SCALE,
    INITIAL_ROTATE,
    ALLOWED_ROTATE,
};
