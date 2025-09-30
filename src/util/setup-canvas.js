export function getDPR(max = 3) {
    const dpr = window.devicePixelRatio || 1;
    return Math.min(max, Math.max(1, dpr));
}

export function measure(el) {
    const r = el.getBoundingClientRect();
    return {
        w: Math.max(1, Math.round(r.width)),
        h: Math.max(1, Math.round(r.height)),
    };
}

export function setupCanvas(canvas, opts = {}) {
    const {
        smoothing = true,
        preserve = true,
        maxDpr = 3,
        willReadFrequently = false,
        observeTarget = null,
        onResize,
    } = opts;

    const init = (dpr) => {
        const { w, h } = measure(canvas);
        canvas.width = Math.max(1, Math.round(w * dpr));
        canvas.height = Math.max(1, Math.round(h * dpr));
        const ctx = canvas.getContext('2d', { willReadFrequently });
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = !!smoothing;
        return ctx;
    };

    let dpr = getDPR(maxDpr);
    const ctx = init(dpr);

    const target = observeTarget || canvas.parentElement || canvas;

    const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        const dprNow = getDPR(maxDpr);

        let snap,
            prevW = canvas.width,
            prevH = canvas.height;
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
