export function getHandles(bounds) {
  const { x, y, w, h } = bounds;
  const cx = x + w / 2,
    cy = y + h / 2;
  const r = 6;
  return [
    { id: 'nw', x, y, r },
    { id: 'n', x: cx, y, r },
    { id: 'ne', x: x + w, y, r },
    { id: 'w', x, y: cy, r },
    { id: 'e', x: x + w, y: cy, r },
    { id: 'sw', x, y: h + y, r },
    { id: 's', x: cx, y: h + y, r },
    { id: 'se', x: x + w, y: h + y, r },
    { id: 'rot', x: cx, y: y - 24, r }, // 회전 핸들
  ];
}

export function hitHandle(handles, px, py) {
  for (const h of handles) {
    const dx = px - h.x,
      dy = py - h.y;
    if (dx * dx + dy * dy <= h.r * h.r) return h;
  }
  return null;
}
