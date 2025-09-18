/**
 * @file draw.js
 * @author YJH
 * @description 도구와 도형
 */
const DRAW = Object.freeze({
  active: Object.freeze({ value: 'brush', label: '붓' }),

  allowedTool: Object.freeze([
    { value: 'brush', label: '붓' },
    { value: 'eraser', label: '지우개' },
  ]),

  allowedShape: Object.freeze([
    { value: 'line', label: '직선' },
    { value: 'circle', label: '원' },
    { value: 'rect', label: '사각형' },
    { value: 'star', label: '별' },
  ]),
});

export { DRAW };
