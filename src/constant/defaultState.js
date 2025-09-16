/**
 * @file defaultState.js
 * @description 초기값이며, object.freeze를 통해 런타임에서 불변성 제공
 * @author YJH
 */

const DRAW_DEFAULT= Object.freeze({
  TOOL:Object.freeze({
    ACTIVE:'brush',
    ALLOWED:['brush','eraser','text, select']
  }),

  STYLE:Object.freeze({
    COLOR: '#000000',
    WIDTH: 5,
  }),

  VIEW:Object.freeze({
    SCALE:1.0,
    ROTATE:0,
  }),

  HISTORY:Object.freeze({
      MODE: 'float32', // unit 16 성능 테스트 필요
      BUDGET_MB: 16,
      MAX_COUNT: Math.floor((16 * 500 * 500) / (500 * 4 * 4)), // 캔버스 뷰포트 기준에 따라 변동 가능  
  }),
})

export { DRAW_DEFAULT };
