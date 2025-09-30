export function getCanvasPosition(canvas, e) {
    const r = canvas.getBoundingClientRect();
    const pt = (e?.touches && e.touches[0]) || e;
    return { x: (pt?.clientX ?? 0) - r.left, y: (pt?.clientY ?? 0) - r.top };
}
