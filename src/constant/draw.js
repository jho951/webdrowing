/**
 * @file draw.js
 * @author YJH
 * @description 그리기 도구/도형 옵션 정의(불변) 및 유틸
 */
import { deepFreeze } from '../util/deep-freeze';

/**
 * @description 옵션 (도구)
 */
const TOOL_ITEMS = deepFreeze([
  { kind: 'tool', value: 'brush', label: '붓' },
  { kind: 'tool', value: 'eraser', label: '지우개' },
]);

/**
 * @description 옵션 (도형)
 */
const SHAPE_ITEMS = deepFreeze([
  { kind: 'shape', value: 'line', label: '직선' },
  { kind: 'shape', value: 'circle', label: '원' },
  { kind: 'shape', value: 'rect', label: '사각형' },
  { kind: 'shape', value: 'curve', label: '곡선' },
]);

/**
 * @description 초기값 (도구)
 */
const INITIAL_TOOL = Object.freeze({
  kind: 'tool',
  value: 'brush',
  label: '붓',
});

/** 도구 + 도형을 하나의 메뉴로 노출(그림판 UX) */
const ALLOWED_TOOL = deepFreeze([...TOOL_ITEMS, ...SHAPE_ITEMS]);

const MAP_BY_VALUE = Object.freeze(
  ALLOWED_TOOL.reduce((acc, o) => {
    acc[o.value] = o;
    return acc;
  }, {})
);

const MAP_BY_LABEL = Object.freeze(
  ALLOWED_TOOL.reduce((acc, o) => {
    acc[o.label] = o;
    return acc;
  }, {})
);

const isToolOption = (o) => !!o && o.kind === 'tool';
const isShapeOption = (o) => !!o && o.kind === 'shape';

const isAllowedValue = (value) => !!MAP_BY_VALUE[String(value)];
const isAllowedLabel = (label) => !!MAP_BY_LABEL[String(label)];

// 값(value) 기반 판별 보조자
const isToolValue = (v) => {
  const opt = getOptionByValue(v);
  return !!opt && isToolOption(opt);
};
const isShapeValue = (v) => {
  const opt = getOptionByValue(v);
  return !!opt && isShapeOption(opt);
};

// 비트맵 도구(브러시/지우개) 공통 정의
const BITMAP_TOOLS = deepFreeze(['brush', 'eraser']);
const isBitmapTool = (v) => BITMAP_TOOLS.includes(String(v));

const getOptionByValue = (value) => MAP_BY_VALUE[String(value)];
const getOptionByLabel = (label) => MAP_BY_LABEL[String(label)];

/** value/label/객체를 받아 안전하게 DrawOption으로 정규화 */
const resolveOption = (input) => {
  if (!input) return INITIAL_TOOL;

  if (typeof input === 'string') {
    return getOptionByValue(input) || getOptionByLabel(input) || INITIAL_TOOL;
  }

  // 객체인 경우: value 우선 조회
  if (input && typeof input === 'object') {
    const byVal = input.value && getOptionByValue(input.value);
    if (byVal) return byVal;

    const byLabel = input.label && getOptionByLabel(input.label);
    if (byLabel) return byLabel;

    // kind/value 일치 시 그대로(참조는 불변 원본과 달라질 수 있으므로 반환은 원본으로)
    if (input.kind && input.value && MAP_BY_VALUE[input.value]) {
      return MAP_BY_VALUE[input.value];
    }
  }

  return INITIAL_TOOL;
};

/* ────────────────────────────────────────────────────────── *
 * 메뉴(툴바) 데이터
 * ────────────────────────────────────────────────────────── */
const MENU = deepFreeze({
  // 그림판처럼 “도구 + 도형”을 한 바에서 선택하게 할 때
  TOOLBAR: ALLOWED_TOOL,

  // 섹션을 나누어 렌더링하고 싶다면:
  SECTIONS: [
    { title: '도구', items: TOOL_ITEMS },
    { title: '도형', items: SHAPE_ITEMS },
  ],
});

/**
 * @description 초기화
 * @param {DrawOption} next 선택될 옵션
 * @param {{tool?:DrawOption, shape?:DrawOption}} current 현재 선택 상태
 * @returns {{tool:DrawOption, shape:DrawOption}}
 */
const reduceSelection = (next, current = {}) => {
  const tool = current.tool ?? INITIAL_TOOL;
  const shape = current.shape ?? SHAPE_ITEMS[0];

  if (isToolOption(next)) {
    return { tool: next, shape: SHAPE_ITEMS[0] };
  }
  if (isShapeOption(next)) {
    return { tool: INITIAL_TOOL, shape: next };
  }
  return { tool, shape };
};

const TOOL = deepFreeze({
  INITIAL_TOOL,
  ALLOWED_TOOL,
});

const HOTKEYS = deepFreeze({
  b: 'brush',
  e: 'eraser',
  l: 'line',
  c: 'circle',
  r: 'rect',
  v: 'curve',
});

/** 키 → 옵션 해석 */
const resolveHotkey = (key) => {
  const v = HOTKEYS[key.toLowerCase()];
  return v ? getOptionByValue(v) : null;
};

export const DRAW = {
  TOOL,
  MENU,
  isToolOption,
  isShapeOption,
  isAllowedValue,
  isAllowedLabel,
  getOptionByValue,
  getOptionByLabel,
  resolveOption,
  resolveHotkey,
  reduceSelection,
  isToolValue,
  isBitmapTool,
  isShapeValue,
};

/* ────────────────────────────────────────────────────────── *
 * (선택) 단축키 매핑 – 필요 시 UI에서 사용
 * ────────────────────────────────────────────────────────── */
