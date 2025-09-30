let targets = [];
export function registerCursorTargets(...els) {
  targets = els.filter(Boolean);
}
export function applyCursor(cursor) {
  const v = cursor || 'default';
  targets.forEach((el) => el && (el.style.cursor = v));
  document.body.style.cursor = v; // 선택 사항
}
