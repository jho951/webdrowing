/**
 * @file get-canvas-pos.js
 * @author YJH
 */

/**
 * @description 마우스 이벤트 좌표를 캔버스 내에서의 상대 좌표로 반환
 * @param {HTMLCanvasElement} canvas - 캔버스
 * @param {MouseEvent|PointerEvent} event - 포인터 이벤트
 * @returns {Object} 캔버스 내 상대 좌표를 포함하는 객체
 * @returns {number} return.x - 캔버스 내 x 좌표
 * @returns {number} return.y - 캔버스 내 y 좌표
 */
 function getCanvasPos(canvas, e) {
  const rect = canvas.getBoundingClientRect();

  let clientX, clientY;
  if (e && e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if (e && e.changedTouches && e.changedTouches[0]) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const dpr =
    (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

  return {
    x: (clientX - rect.left) * dpr,
    y: (clientY - rect.top) * dpr,
  };
}


export{getCanvasPos}