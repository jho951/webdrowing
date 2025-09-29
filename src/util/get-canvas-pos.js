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
function getCanvasPos(canvas, event) {
  if (!canvas) {
    console.warn('getCanvasPos called with null canvas');
    return { x: 0, y: 0 };
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

export { getCanvasPos };
