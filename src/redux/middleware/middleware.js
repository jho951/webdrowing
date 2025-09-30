export const UNDO = 'history/UNDO';
export const REDO = 'history/REDO';
export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

const TRACKED = new Set([
  'shape/addShape',
  'text/addTextBox',
  'text/updateTextBox',
  'image/placeImage',
  'bitmap/commitBitmap',
  'style/setStrokeColor',
  'style/setStrokeWidth',
  'style/setStrokeDash',
  'style/setFillColor',
  'style/setFillOpacity',
]);

// 3) 스냅샷 생성기: "문서 상태"만 가볍게 캡처
function makeSnapshot(state) {
  return {
    shape: state.shape,
    text: state.text,
    image: state.image,
    style: state.style,
    bitmap: state.bitmap, // 비트맵 픽셀 대신 snapshotId 등만 들고 있게 설계
    // select/view/mode 등은 보통 제외 (원하면 추가)
  };
}

// 4) 복원 액션 (슬라이스들이 extraReducers로 받아 자기 상태를 교체)
export const RESTORE_FROM_HISTORY = 'history/RESTORE_FROM_HISTORY';
export const restoreFromHistory = (snapshot) => ({
  type: RESTORE_FROM_HISTORY,
  payload: snapshot,
});

// 5) 미들웨어 내부 스택 (간단 MVP — 리로드 시 초기화됨)
const LIMIT = 100;
const stateHistory = {
  past: [],
  future: [],
  lastGroup: null, // 코얼레싱 키
};

// 6) 미들웨어 본체
export const historyMiddleware = (store) => (next) => (action) => {
  // UNDO/REDO는 여기서 처리
  if (action.type === UNDO) {
    if (!stateHistory.past.length) return;
    const prev = stateHistory.past.pop();
    const now = makeSnapshot(store.getState());
    stateHistory.future.push(now);
    store.dispatch(restoreFromHistory(prev));
    return; // 이 액션은 여기서 소비
  }

  if (action.type === REDO) {
    if (!stateHistory.future.length) return;
    const snap = stateHistory.future.pop();
    // 현재 상태는 past로 푸시(redo 되돌리기 가능)
    const now = makeSnapshot(store.getState());
    stateHistory.past.push(now);
    store.dispatch(restoreFromHistory(snap));
    return;
  }

  if (TRACKED.has(action.type)) {
    const before = makeSnapshot(store.getState());

    // 그룹 코얼레싱: action.meta.group이 이전과 같으면 덮어쓰기
    const group = action.meta?.group || null;
    if (group && stateHistory.lastGroup === group && stateHistory.past.length) {
      stateHistory.past[stateHistory.past.length - 1] = before;
    } else {
      stateHistory.past.push(before);
      if (stateHistory.past.length > LIMIT) stateHistory.past.shift();
      stateHistory.lastGroup = group;
    }
    // 새 변경이 오면 redo 스택은 비움
    stateHistory.future.length = 0;
  }

  return next(action);
};
