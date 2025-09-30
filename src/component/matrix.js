// 간단한 2D 행렬 유틸 (뷰 변환 역/정 변환)
export type View = { zoom: number; rotation: number; panX: number; panY: number };
export function worldToScreen(x: number, y: number, ctx: CanvasRenderingContext2D, view: View) {
  // applyView로 만든 것과 동일한 변환을 수학으로: 화면 중심 기준
  const dpr = window.devicePixelRatio || 1;
  const cw = ctx.canvas.width / dpr, ch = ctx.canvas.height / dpr;

  // 화면 중심으로 이동
  let px = x - cw/2;
  let py = y - ch/2;
  // 줌/회전/팬 적용
  const rad = (view.rotation * Math.PI) / 180;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  // scale
  px *= view.zoom; py *= view.zoom;
  // rotate
  const rx = px * cos - py * sin;
  const ry = px * sin + py * cos;
  // translate back + pan
  return { x: rx + cw/2 + view.panX, y: ry + ch/2 + view.panY };
}
