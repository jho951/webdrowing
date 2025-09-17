/**
 * 크기 조절 시작 핸들러
 * @param {*} e 해당 이벤트
 * @param {*} isResizingRef 크기 조절할 ref
 * @param {*} startPosRef  시작 위치 ref
 */
const handleMouseDown = (e, isResizingRef, startPosRef) => {
  e.stopPropagation();
  isResizingRef.current = true;
  startPosRef.current = {
    x: e.clientX,
    y: e.clientY,
  };
};

export { handleMouseDown };
