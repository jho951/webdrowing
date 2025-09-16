/**
 * @file defaultState.js
 * @description v1 초기값. Object.freeze로 런타임 불변성을 보장합니다.
 * @author YJH
 */

/**
 * 기본 설정 상수 집합
 * - TOOL: 도구의 활성값 및 허용 목록
 * - STYLE: 선 색상/두께 기본값
 * - VIEW: 뷰 스케일/회전 기본값
 * - HISTORY: 히스토리 저장 방식/예산/최대 개수
 */
const DRAW_DEFAULT = Object.freeze({
  TOOL: Object.freeze({
    /** 초기 활성 도구 */
    ACTIVE: 'brush',
    /** 허용 도구 리스트 */
    ALLOWED: Object.freeze(['brush', 'eraser', 'text', 'select']),
  }),

  STYLE: Object.freeze({
    /** 기본 선 색상 (hex) */
    COLOR: '#000000',
    /** 기본 선 두께 (px) */
    WIDTH: 5,
  }),

  VIEW: Object.freeze({
    /** 초기 스케일 배율 */
    SCALE: 1.0,
    /** 초기 회전 각도 (deg) */
    ROTATE: 0,
  }),

  HISTORY: Object.freeze({
    /**
     * 저장 모드 (예: 좌표/스트로크 데이터 정밀도)
     * - 'float32' 기본, 'uint16' 성능/용량 테스트 예정
     */
    MODE: 'float32',
    /** 히스토리 메모리 예산 (MB) */
    BUDGET_MB: 16,
    /** 히스토리 최대 스냅샷 개수 */
    MAX_COUNT: 500,
  }),
});

/**
 * 툴 상태 초기화 팩토리
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
    // 좌표/히스토리 정밀도 기본값을 coordMode에 재사용
    coordMode: DRAW_DEFAULT.HISTORY.MODE, // 'float32'
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
