const maxUndoStates = 30;
const undoStack = [];
const redoStack = [];

// 가상의 그림판 작업
function performDrawingAction(data) {
    // 현재 상태를 캐싱
    if (undoStack.length >= maxUndoStates) {
        undoStack.shift(); // 오래된 데이터 제거
    }
    undoStack.push(data);
    redoStack.length = 0; // redo 스택 초기화
}

// 1000번의 작업 시뮬레이션
for (let i = 0; i < 1000; i++) {
    const randomData = new Array(100).fill(Math.random()); // 더미 데이터
    performDrawingAction(randomData);
    if (i % 100 === 0) {
        // 100회마다 메모리 사용량을 로그
        console.log(`[${i}회] undoStack 크기: ${undoStack.length}`);
        console.log('현재 메모리 사용량을 개발자 도구로 확인하세요.');
    }
}
