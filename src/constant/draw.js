/**
 * @file draw.js
 * @author YJH
 * @description 도구와 도형
 */
const DRAW = Object.freeze({
  active: Object.freeze({
    value: 'brush',
    label: '붓',
    pointer: 'cross-header',
  }),

  allowedTool: Object.freeze([
    { value: 'brush', label: '붓', pointer: 'cross-header' },
    { value: 'eraser', label: '지우개', pointer: 'cross-header' },
  ]),

  allowedShape: Object.freeze([
    { value: 'line', label: '직선', pointer: 'cross-header' },
    { value: 'circle', label: '원', pointer: 'cross-header' },
    { value: 'rect', label: '사각형', pointer: 'cross-header' },
    { value: 'star', label: '별', pointer: 'cross-header' },
  ]),
});

export { DRAW };
