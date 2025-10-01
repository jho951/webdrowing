/**
 * @file setup-canvas.js
 * @author YJH
 */

/**
 * @function getDPR
 * @description
 * - dpr 설정
 * @param {*} max 한계치
 * @returns {Math.min(max, Math.max(1, dpr))}
 */
function getDPR(max = 3) {
    const dpr = window.devicePixelRatio || 1;
    return Math.min(max, Math.max(1, dpr));
}

/**
 * @function getDPR
 * @description
 * - 요소 크기와 뷰포트에 상대적인 위치
 * @param {*} ele  - 한계치
 * @returns {w,h}  - width, height
 */
function measure(ele) {
    const rect = ele.getBoundingClientRect();
    return {
        w: Math.max(1, Math.round(rect.width)),
        h: Math.max(1, Math.round(rect.height)),
    };
}

/**
 * @file get-canvas-position
 * @author YJH
 * @description
 * - 뷰포트 기준 상대 크기
 * @param {*} canvas
 * @param {*} e
 * @returns xrr
 */
function getCanvasPosition(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const pt = (e?.touches && e.touches[0]) || e;
    return { x: (pt?.clientX ?? 0) - r.left, y: (pt?.clientY ?? 0) - r.top };
}

/**
 * 오버레이 전체 클리어
 * @param {CanvasRenderingContext2D} ctx
 */
function clearOverlay(ctx) {
    if (!ctx) return;
    const c = ctx.canvas;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.restore();
}

/**
 * 좌클릭(또는 펜/터치)만 통과시키고, 마우스 우클릭 등은 차단할 때 사용
 * @param {PointerEvent} e
 * @returns {boolean}
 */
function isPrimaryPointer(e) {
    return !(e.pointerType === 'mouse' && e.button !== 0);
}

function setupCanvas(canvas, opts = {}) {
    const {
        smoothing = true,
        preserve = true,
        maxDpr = 3,
        willReadFrequently = false,
        observeTarget = null,
        onResize,
    } = opts;

    let dpr = getDPR(maxDpr);
    const init = (dpr) => {
        const { w, h } = measure(canvas);
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        const ctx = canvas.getContext('2d', {
            willReadFrequently: willReadFrequently,
        });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = !!smoothing;
        return ctx;
    };
    const ctx = init(dpr);

    const target = observeTarget || canvas;

    const ro = new ResizeObserver((e) => {
        const entry = e[0];
        const dprNow = getDPR(maxDpr);

        let snap;
        let prevW = canvas.width;
        let prevH = canvas.height;

        if (preserve) {
            snap = document.createElement('canvas');
            snap.width = prevW;
            snap.height = prevH;
            const sctx = snap.getContext('2d');
            sctx.drawImage(canvas, 0, 0);
        }

        const cssW = entry?.contentRect?.width ?? measure(canvas).w;
        const cssH = entry?.contentRect?.height ?? measure(canvas).h;
        canvas.width = Math.max(1, Math.round(cssW * dprNow));
        canvas.height = Math.max(1, Math.round(cssH * dprNow));
        ctx.setTransform(dprNow, 0, 0, dprNow, 0, 0);
        ctx.imageSmoothingEnabled = !!smoothing;
        if (preserve && snap) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(
                snap,
                0,
                0,
                prevW,
                prevH,
                0,
                0,
                canvas.width,
                canvas.height
            );
            ctx.restore();
        } else {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        dpr = dprNow;
        onResize?.(ctx);
    });

    ro.observe(target);
    return { ctx, teardown: () => ro.disconnect() };
}

export {
    getDPR,
    measure,
    getCanvasPosition,
    clearOverlay,
    isPrimaryPointer,
    setupCanvas,
};
