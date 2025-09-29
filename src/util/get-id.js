/**
 * @file get-id.js
 * @author YJH
 */
/**
 * @description UUID 아이디 생성
 * @return UUID id
 */
function getId() {
  return crypto.randomUUID?.();
}

export { getId };
