/**
 * @file bitmap-history.js
 * @description 비트맵 캔버스 Undo/Redo (스트로크 단위 before/after, 히스토리 커서)
 */

const STORE = new WeakMap();
// bucket: { entries: [{before:ImageData, after:ImageData}], index:number, max:number, size:{w,h}, tempBefore:ImageData|null }

function getBucket(ctx) {
    if (!ctx) return null;
    let b = STORE.get(ctx);
    if (!b) {
        b = {
            entries: [],
            index: -1,
            max: 40,
            size: { w: ctx.canvas.width, h: ctx.canvas.height },
            tempBefore: null,
        };
        STORE.set(ctx, b);
    }
    return b;
}

function sameSize(ctx, imgData) {
    return (
        imgData &&
        imgData.width === ctx.canvas.width &&
        imgData.height === ctx.canvas.height
    );
}

function notify(ctx) {
    // 버튼/UI에서 상태 갱신을 쉽게 하기 위한 이벤트
    const ev = new CustomEvent('bitmap-history-changed', { detail: { ctx } });
    window.dispatchEvent(ev);
}

/** 리사이즈/DPR 변경 시 히스토리 초기화 (사이즈가 바뀌면 ImageData 불일치) */
export function bitmapHistoryOnResize(ctx) {
    const b = getBucket(ctx);
    if (!b) return;
    b.entries = [];
    b.index = -1;
    b.size = { w: ctx.canvas.width, h: ctx.canvas.height };
    b.tempBefore = null;
    notify(ctx);
}

/** 스트로크 시작: 현재 상태 캡처(이전 상태) */
export function beginStroke(ctx) {
    const b = getBucket(ctx);
    if (!b) return;
    try {
        const before = ctx.getImageData(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );
        b.tempBefore = before;
    } catch {
        b.tempBefore = null;
    }
}

/** 내부: 변화가 없는 스트로크는 저장하지 않도록 간단 비교 */
function isSameImage(a, b) {
    if (!a || !b) return false;
    if (a.width !== b.width || a.height !== b.height) return false;
    // 너무 무거우니 전체 비교 대신 몇 샘플만 체크(휴리스틱)
    const da = a.data,
        db = b.data;
    if (da.length !== db.length) return false;
    const step = Math.max(1, Math.floor(da.length / 2000));
    for (let i = 0; i < da.length; i += 4 * step) {
        if (
            da[i] !== db[i] ||
            da[i + 1] !== db[i + 1] ||
            da[i + 2] !== db[i + 2] ||
            da[i + 3] !== db[i + 3]
        ) {
            return false; // 다름
        }
    }
    return true; // 같다고 간주
}

/** 스트로크 끝: after 캡처하고 히스토리 엔트리로 푸시 */
export function endStroke(ctx) {
    const b = getBucket(ctx);
    if (!b) return;

    if (b.size.w !== ctx.canvas.width || b.size.h !== ctx.canvas.height) {
        bitmapHistoryOnResize(ctx);
    }

    // beginStroke에서 저장한 before가 없으면 기록 안 함
    if (!b.tempBefore || !sameSize(ctx, b.tempBefore)) {
        b.tempBefore = null;
        return;
    }

    // after 캡처
    let after = null;
    try {
        after = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    } catch {
        /* empty */
    }

    // 변화 없으면 스킵
    if (!after || isSameImage(b.tempBefore, after)) {
        b.tempBefore = null;
        return;
    }

    // 1) 현재 커서 뒤에 있는 redo 브랜치 제거
    //    (index가 마지막이 아니라면 index+1부터 끝까지 제거)
    if (b.index < b.entries.length - 1) {
        b.entries.splice(b.index + 1);
    }

    // 2) 새 엔트리 push
    b.entries.push({ before: b.tempBefore, after });

    // 3) 최대 길이 캡 & 커서 이동
    if (b.entries.length > b.max) {
        // 넘친 만큼 앞에서 제거 (보통 1개)
        const overflow = b.entries.length - b.max;
        b.entries.splice(0, overflow);
    }
    // 항상 커서를 마지막으로 이동
    b.index = b.entries.length - 1;

    // 임시 before 리셋 + 알림
    b.tempBefore = null;
    notify(ctx);
}

/** 되돌리기 */
export function undoBitmap(ctx) {
    const b = getBucket(ctx);
    if (!b) return;
    if (b.index < 0) return; // nothing to undo

    const entry = b.entries[b.index];
    try {
        ctx.putImageData(entry.before, 0, 0);
        b.index--;
        notify(ctx);
    } catch {
        /* empty */
    }
}

/** 다시하기 */
export function redoBitmap(ctx) {
    const b = getBucket(ctx);
    if (!b) return;
    if (b.index >= b.entries.length - 1) return;

    const entry = b.entries[b.index + 1];
    try {
        ctx.putImageData(entry.after, 0, 0);
        b.index++;
        notify(ctx);
    } catch {
        /* empty */
    }
}

export function canUndoBitmap(ctx) {
    const b = getBucket(ctx);
    return !!(b && b.index >= 0);
}
export function canRedoBitmap(ctx) {
    const b = getBucket(ctx);
    return !!(b && b.index < b.entries.length - 1);
}

export function clearBitmapHistory(ctx) {
    const b = getBucket(ctx);
    if (!b) return;
    b.entries = [];
    b.index = -1;
    b.tempBefore = null;
    notify(ctx);
}
