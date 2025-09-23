export const SHAPE_TYPES = {
  RECT: 'rect',
  ELLIPSE: 'ellipse', // circle 포함
  LINE: 'line',
  POLYGON: 'polygon', // star는 polygon으로 생성
};

const newId = () => (crypto.randomUUID?.() || String(Date.now() + Math.random()));

const defaultStyle = (overrides = {}) => ({
  stroke: '#111',
  fill: null,
  lineWidth: 2,
  lineDash: [],
  opacity: 1,
  ...overrides,
});

export const makeRect = ({ x, y, w, h, style } = {}) => ({
  id: newId(), type: SHAPE_TYPES.RECT, x, y, w, h, ...defaultStyle(style),
});
export const makeEllipse = ({ cx, cy, rx, ry, style } = {}) => ({
  id: newId(), type: SHAPE_TYPES.ELLIPSE, cx, cy, rx, ry, ...defaultStyle(style),
});
export const ellipseFromBox = ({ x, y, w, h, style } = {}) =>
  makeEllipse({ cx: x + w/2, cy: y + h/2, rx: Math.abs(w/2), ry: Math.abs(h/2), style });

export const makeLine = ({ x1, y1, x2, y2, style } = {}) => ({
  id: newId(), type: SHAPE_TYPES.LINE, x1, y1, x2, y2, ...defaultStyle(style),
});

export const makeStar = ({ cx, cy, points = 5, outerR, innerR, rotation = 0, style } = {}) => {
  const rad = (d) => d * Math.PI / 180;
  const verts = [];
  const step = 360 / (points * 2);
  let a = rotation - 90;
  for (let i = 0; i < points * 2; i++) {
    const r = (i % 2 === 0) ? outerR : innerR;
    verts.push({ x: cx + r * Math.cos(rad(a)), y: cy + r * Math.sin(rad(a)) });
    a += step;
  }
  return { id: newId(), type: SHAPE_TYPES.POLYGON, points: verts, ...defaultStyle(style) };
};

// 팔레트 value와 드래그 시작/끝 좌표로 도형 생성
export function shapeFromDrag(kind, p0, p1, style) {
  const x = Math.min(p0.x, p1.x), y = Math.min(p0.y, p1.y);
  const w = Math.abs(p1.x - p0.x), h = Math.abs(p1.y - p0.y);
  if (w === 0 && h === 0) return null;

  switch (kind) {
    case 'rect':
      return makeRect({ x, y, w, h, style });

    case 'circle': {
      const s = Math.max(w, h);
      return ellipseFromBox({ x, y, w: s, h: s, style }); // 원
    }

    case 'line':
      return makeLine({ x1: p0.x, y1: p0.y, x2: p1.x, y2: p1.y, style });

    case 'star': {
      const cx = x + w/2, cy = y + h/2;
      const outerR = Math.max(w, h) / 2;
      const innerR = outerR * 0.5;
      return makeStar({ cx, cy, outerR, innerR, points: 5, style });
    }

    default:
      return null;
  }
}
