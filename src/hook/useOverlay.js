/**
 * @file useOverlay.js
 * @description 오버레이(가벼운 프리뷰/가이드) 훅
 */

import { getCanvasPosition } from '../util/canvas-helper';

function useOverlay(canvasRef, ctxRef, { mode, bitmapRef }) {
    function clear(ctx, canvas) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function drawCrosshair(ctx, p) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00000066';
        ctx.beginPath();
        ctx.moveTo(p.x - 10, p.y);
        ctx.lineTo(p.x + 10, p.y);
        ctx.moveTo(p.x, p.y - 10);
        ctx.lineTo(p.x, p.y + 10);
        ctx.stroke();
        ctx.restore();
    }

    function redrawOverlay() {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        clear(ctx, canvas);
    }

    function onPointerDown() {}
    function onPointerUp() {}
    function onPointerCancel() {}

    function onPointerMove(e) {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        const p = getCanvasPosition(canvas, e);
        clear(ctx, canvas);
        drawCrosshair(ctx, p);
    }

    const onPointerLeave = redrawOverlay;

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerLeave,
        onPointerCancel,
        redrawOverlay,
    };
}

export { useOverlay };
