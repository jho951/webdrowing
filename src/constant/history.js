/**
 * @file history.js
 * @description undo/redo 스택 관련 불변 상수
 */
import { deepFreeze } from '../util/deep-freeze';

const HISTORY_TYPE = 'history';

/**
 * @description 비트맵/벡터 공통 히스토리 제한
 */
const DEFAULT_LIMIT = 10;

/**
 * @description 채널 구분 (bitmap vs vector)
 */
const CHANNEL = deepFreeze({
    BITMAP: 'bitmap',
    VECTOR: 'vector',
});

/**
 * @description 지원되는 액션 타입 prefix
 * (미들웨어/슬라이스에서 일관성있게 사용)
 */
const ACTION = deepFreeze({
    UNDO_BITMAP: 'history/UNDO_BITMAP',
    REDO_BITMAP: 'history/REDO_BITMAP',
    UNDO_VECTOR: 'history/UNDO_VECTOR',
    REDO_VECTOR: 'history/REDO_VECTOR',
    RESTORE_VECTOR: 'history/RESTORE_VECTOR',
});

const VECTOR_KEYS = ['shape', 'text', 'image', 'select'];

export const HISTORY = {
    VECTOR_KEYS,
    HISTORY_TYPE,
    DEFAULT_LIMIT,
    CHANNEL,
    ACTION,
};
