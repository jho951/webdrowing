/**
 * @file src/redux/middleware/historyChannels.js
 * @description
 * - 비트맵/벡터 채널을 분리해서 자동으로 past/future를 관리하는 미들웨어
 * - 비트맵: bitmap/commitBitmap -> history/pushPastBitmap
 * - 벡터: shape 변경 액션(화이트리스트) -> history/pushPastVector (state.shape 스냅샷)
 * - 벡터 undo/redo: history/undoVector, history/redoVector 인터셉트 → shape/replaceAll로 상태 복원
 *
 * NOTE:
 * - 아래 액션 타입들은 네 슬라이스에 맞게 필요하면 문자열만 바꿔주면 된다.
 * - 히스토리 리듀서(historySlice)에 vector 채널 API가 있어야 한다:
 *   pushPastVector, pushFutureVector, popPastVector, popFutureVector, clearVectorHistory 등.
 * - shapeSlice에 replaceAll(상태 스냅샷 통째로 교체) 리듀서가 있어야 한다.
 */

// 비트맵 스냅샷 커밋 액션(이미 bitmapSlice에 존재한다고 가정)
const BITMAP_COMMIT = 'bitmap/commitBitmap';

// 벡터(도형) 변경 액션 화이트리스트 예시
// - shapeSlice에서 도형을 실제로 변경하는 액션 타입을 여기에 나열하세요.
const VECTOR_MUTATIONS = [
    'shape/add',
    'shape/update',
    'shape/remove',
    'shape/transform',
    'shape/reorder',
    'shape/clear',
];

// vector 채널용 history 액션들 (historySlice에 구현되어 있어야 함)
const PUSH_PAST_VECTOR = 'history/pushPastVector';
const PUSH_FUTURE_VECTOR = 'history/pushFutureVector';
const POP_PAST_VECTOR = 'history/popPastVector';
const POP_FUTURE_VECTOR = 'history/popFutureVector';

// 벡터 전용 undo/redo 트리거(원하는 이름으로 단축키/버튼에서 디스패치)
const UNDO_VECTOR = 'history/undoVector';
const REDO_VECTOR = 'history/redoVector';

// shape 전체 상태 교체 액션 (shapeSlice에 구현 필요: payload = 새 스냅샷)
const SHAPE_REPLACE_ALL = 'shape/replaceAll';

/* ------------------------------------------------------
 * 비트맵 채널 미들웨어
 * - bitmap/commitBitmap이 들어오면 history/pushPastBitmap으로 중계
 * ----------------------------------------------------*/
export function bitmapChannelMiddleware({ dispatch }) {
    return (next) => (action) => {
        const result = next(action);

        if (action.type === BITMAP_COMMIT) {
            const snap =
                action.payload && (action.payload.snapshot ?? action.payload);
            if (snap) {
                dispatch({
                    type: 'history/pushPastBitmap',
                    payload: { snapshot: snap },
                });
                // 비트맵은 future 정리는 history 리듀서가 책임지도록 설계
            }
        }

        return result;
    };
}

/* ------------------------------------------------------
 * 벡터 채널 미들웨어
 * - shape 변경 액션 → next(action) 후 최신 state.shape를 스냅샷으로 pushPastVector
 * - undo/redo 트리거 → history pop → shape/replaceAll 로 복원
 * ----------------------------------------------------*/
export function vectorChannelMiddleware({ getState, dispatch }) {
    return (next) => (action) => {
        // 1) 벡터 undo/redo 먼저 처리 (다른 리듀서에 닿기 전에 인터셉트)
        if (action.type === UNDO_VECTOR) {
            // past에서 하나 빼와서 shape 상태로 적용
            // pop 전 스냅샷을 history 리듀서에서 반환해주지 않으면
            // → 미리 state에서 참조하거나, pop 액션을 동기 리듀서로 구현해서 미들웨어가 getState로 읽게 하세요.
            // 여기서는 "pop 후 history 리듀서가 last를 state.history.vector.applied에 저장한다"는 패턴 예시로 작성.
            const result = next({ type: POP_PAST_VECTOR });
            const snap = getState()?.history?.vector?.applied; // 리듀서에서 마지막 pop 결과를 여기에 둔다고 가정
            if (snap) {
                dispatch({
                    type: PUSH_FUTURE_VECTOR,
                    payload: { snapshot: getState().shape },
                });
                dispatch({ type: SHAPE_REPLACE_ALL, payload: snap });
            }
            return result;
        }

        if (action.type === REDO_VECTOR) {
            const result = next({ type: POP_FUTURE_VECTOR });
            const snap = getState()?.history?.vector?.applied;
            if (snap) {
                dispatch({
                    type: PUSH_PAST_VECTOR,
                    payload: { snapshot: getState().shape },
                });
                dispatch({ type: SHAPE_REPLACE_ALL, payload: snap });
            }
            return result;
        }

        // 2) 일반 액션은 먼저 통과시켜 변경을 적용
        const prevState = getState();
        const result = next(action);
        const nextState = getState();

        // 3) 벡터 변경 액션이면, 적용된 결과(nextState.shape)를 스냅샷으로 push
        if (VECTOR_MUTATIONS.includes(action.type)) {
            const snap = nextState.shape; // 전체 shape 서브트리 스냅샷
            // 깊은 복사(필요 시): JSON 방식은 함수/순환참조에 취약 → 상태가 POJO면 OK
            const cloned = JSON.parse(JSON.stringify(snap));
            dispatch({ type: PUSH_PAST_VECTOR, payload: { snapshot: cloned } });
            // future 정리는 history 리듀서가 책임지도록 설계
        }

        return result;
    };
}

/* ------------------------------------------------------
 * 번들러: 스토어에서 (gdm)=>buildAppMiddleware(gdm) 형태로 사용
 * ----------------------------------------------------*/
export default function buildAppMiddleware(getDefaultMiddleware) {
    const base = getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [
                // 비트맵/벡터 히스토리 채널 관련 액션들 (스냅샷 비직렬 가능)
                'history/pushPastBitmap',
                'history/pushFutureBitmap',
                'history/popPastBitmap',
                'history/popFutureBitmap',
                'bitmap/commitBitmap',

                PUSH_PAST_VECTOR,
                PUSH_FUTURE_VECTOR,
                POP_PAST_VECTOR,
                POP_FUTURE_VECTOR,
                UNDO_VECTOR,
                REDO_VECTOR,
                SHAPE_REPLACE_ALL,
            ],
            ignoredPaths: [
                'history.bitmap.past',
                'history.bitmap.future',
                'bitmap.snapshot',

                'history.vector.past',
                'history.vector.future',
                'history.vector.applied',
                'shape',
            ],
        },
        immutableCheck: false,
    });

    return base.concat(bitmapChannelMiddleware, vectorChannelMiddleware);
}
