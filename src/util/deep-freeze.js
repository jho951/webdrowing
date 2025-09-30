/**
 * @file deep-freeze.js
 * @author YJH
 * @function deepFreeze
 * @description
 * object나 array를 동결해 불변성을 갖게하는 유틸리티 함수입니다.
 *
 * @feature
 * - 중첩된 객체와 배열까지 모두 불변 상수 적용
 * - 재선언을 통한 데이터 변경 방지
 * - 읽기는 가능해 순수함수를 통한 변경은 가능
 * - 원본을 바꾸는 메서드는 에러를 발생시킴
 *
 * @warn
 * - 동작 방식으로 인해 모든 객체를 사용 시 오버헤드가 발생
 *
 * @param {object|Array} obj - 불변으로 만들 객체 또는 배열
 * @returns {object|Array} - 모든 하위 속성까지 동결된 객체/배열
 *
 * @example
 * const EXAMPLE = deepFreeze({
 *   image: { url: "https://example.com", width:500},
 *   style: { color: "blue", size: 12 }
 * });
 * EXAMPLE.image.url = "https://hack.com"; // 에러
 * CONFIG.items.push(4); // 에러
 *
 * const doubled = CONFIG.items.map(x => x * 2); // [2, 4, 6]
 */
function deepFreeze(obj) {
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
        Object.freeze(obj);
        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (value && typeof value === 'object' && !Object.isFrozen(value)) {
                deepFreeze(value);
            }
        });
    }
    return obj;
}

export { deepFreeze };
