/**
 * @file deep-freeze.js
 * @author YJH
 */

/**
 * @description 선언된 객체와 배열의 속성 변경을 막아 불변성을 보장
 * @param {object | Array} obj 불변 객체 | 배열
 * @returns {object | Array} obj
 * @example const TOOL = deepFreeze({id:'',name:''})
 */
function deepFreeze(obj) {
  if (typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
  } else {
    console.warn('적용할 대상이 아닙니다.');
  }
  return obj;
}
export { deepFreeze };
