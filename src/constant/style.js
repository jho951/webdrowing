/**
 * @file view.js
 * @author YJH
 * @description 대시보드의 영역의 확대, 축소, 회전
 */
const STYLE = Object.freeze({
  activeColor: Object.freeze({ value: '#000000', label: 'black' }),
  allowedColor: Object.freeze([
    { value: '#000000', label: '검정' },
    { value: '#FFFFFF', label: '흰색' },
    { value: '#FF0000', label: '빨강' },
    { value: '#0000FF', label: '파랑' },
    { value: '#00FF00', label: '초록' },
    { value: '#FFFF00', label: '노랑' },
  ]),

  activeWidth: Object.freeze({ value: 5, label: 'normal' }),
  allowedWidth: Object.freeze([
    { value: 9, label: '9px' },
    { value: 7, label: '7px' },
    { value: 5, label: '5px' },
    { value: 3, label: '3px' },
    { value: 1, label: '1px' },
  ]),
});

export { STYLE };
