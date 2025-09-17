/**
 * @file defaultState.js
 * @description v1 초기값. Object.freeze로 런타임 불변성을 보장합니다.
 * @author YJH
 */

/**
 * 기본 설정 상수 집합
 * - DRAW: 그리기 활성타입 및 허용 목록
 * - STYLE: 선 색상/두께 기본값
 * - VIEW: 뷰 스케일/회전 기본값
 * - SIZE: 캔버스 크기
 * - HISTORY: 히스토리 저장 방식/예산/최대 개수
 */
const DRAW_DEFAULT = Object.freeze({
  DRAW: Object.freeze({
    active: Object.freeze({ value: 'brush', label: '붓' }),

    allowed: Object.freeze({
      tool: [
        { value: 'brush', label: '붓' },
        { value: 'eraser', label: '지우개' },
      ],
      shape: [
        { value: 'line', label: '직선' },
        { value: 'curve', label: '곡선' },
        { value: 'circle', label: '원' },
        { value: 'rect', label: '사각형' },
        { value: 'triangle', label: '삼각형' },
        { value: 'star', label: '별' },
      ],
    }),
  }),

  STYLE: Object.freeze({
    activeColor: Object.freeze({ value: '#000000', label: 'black' }),
    allowedColor: Object.freeze([
      { value: '#000000', label: 'black' },
      { value: '#FFFFFF', label: 'white' },
      { value: '#FF0000', label: 'red' },
      { value: '#0000FF', label: 'blue' },
      { value: '#00FF00', label: 'green' },
      { value: '#FFFF00', label: 'yellow' },
    ]),

    activeWidth: Object.freeze({ value: 5, label: 'normal' }),
    allowedWidth: Object.freeze([
      { value: 9, label: 'thickest' },
      { value: 7, label: 'thick' },
      { value: 5, label: 'normal' },
      { value: 3, label: 'thin' },
      { value: 1, label: 'thinest' },
    ]),
  }),

  SIZE: Object.freeze({
    width: 300,
    height: 300,
  }),

  VIEW: Object.freeze({
    SCALE: 1.0,
    ROTATE: 0,
  }),

  HISTORY: Object.freeze({
    MODE: 'float32', // 성능 테스트
    BUDGET_MB: 16,
    MAX_COUNT: 500,
  }),
});

/**
 * 툴 상태 초기화
 * @param {{ defaultTool?: string }} [opts]
 * @returns {{ activeTool: string, style: { color: string, width: number }, coordMode: string }}
 */
function makeInitialToolState(opts = {}) {
  return {
    activeTool: opts.defaultTool ?? DRAW_DEFAULT.TOOL.ACTIVE,
    style: {
      color: DRAW_DEFAULT.STYLE.COLOR,
      width: DRAW_DEFAULT.STYLE.WIDTH,
    },
    coordMode: DRAW_DEFAULT.HISTORY.MODE,
  };
}

/**
 * 뷰 상태 초기화 팩토리
 * @returns {{ scale: number, rotate: number }}
 */
function makeInitialViewState() {
  return {
    scale: DRAW_DEFAULT.VIEW.SCALE,
    rotate: DRAW_DEFAULT.VIEW.ROTATE,
  };
}

/**
 * 문서(스트로크/히스토리) 상태 초기화 팩토리
 * @returns {{
 *   strokes: any[],
 *   redoStack: any[],
 *   history: { budgetMB: number, maxCount: number, storeMode: string, totalBytes: number }
 * }}
 */
function makeInitialDocState() {
  return {
    strokes: [],
    redoStack: [],
    history: {
      budgetMB: DRAW_DEFAULT.HISTORY.BUDGET_MB,
      maxCount: DRAW_DEFAULT.HISTORY.MAX_COUNT,
      storeMode: DRAW_DEFAULT.HISTORY.MODE,
      totalBytes: 0,
    },
  };
}

/**
 * 단일 export로 묶인 기본 상태 모듈
 */
const DefaultState = Object.freeze({
  DRAW_DEFAULT,
  makeInitialToolState,
  makeInitialViewState,
  makeInitialDocState,
});

export default DefaultState;
