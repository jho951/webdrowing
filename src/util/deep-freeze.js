/**
 * @file depp-freeze.js
 * @author YJH
 * @param {} obj // 불변시킬 객체 | 배열
 * @returns
 */
const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (
      value &&
      (typeof value === 'object' || typeof value === 'function') &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
};

export { deepFreeze };
