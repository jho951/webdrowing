const DRAW = Object.freeze({
  active: { value: 'brush', label: '붓' },

  allowedTool: [
    { value: 'brush', label: '붓' },
    { value: 'eraser', label: '지우개' },
  ],

  allowedShape: [
    { value: 'line', label: '직선' },
    // { value: 'curve', label: '곡선' },
    { value: 'circle', label: '원' },
    { value: 'rect', label: '사각형' },
    // { value: 'triangle', label: '삼각형' },
    { value: 'star', label: '별' },
  ],
});

export { DRAW };
