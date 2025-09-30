/**
 * @file setup-canvas.js
 * @author YJH
 * @description 캔버스 설정 유틸
 */

/**
 *  @description 레이어별 캡/최솟값 적용
 */
function getDPR(cap = Infinity, min = 1) {
  const raw = window.devicePixelRatio || 1;
  return Math.max(min, Math.min(cap, raw));
}

/**
 * @description 비트맵 크기 계산
 */
function measure(canvas) {
  const rect = canvas.getBoundingClientRect();
  const cssW = Math.max(1, Math.round(rect.width));
  const cssH = Math.max(1, Math.round(rect.height));
  return { cssW, cssH };
}

/**
 * @description DPR 적용 리사이즈 컨텍스트 옵션 공통
 * @param {*} canvas
 * @param {*} param1
 * @returns
 */
function setupCanvasBase(
  canvas,
  {
    dpr = getDPR(),
    contextAttributes = {},
    smoothing = true,
    alpha = true,
  } = {}
) {
  const { cssW, cssH } = measure(canvas);

  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  canvas.width = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.max(1, Math.round(cssH * dpr));

  const ctx = canvas.getContext('2d', { alpha, ...contextAttributes });
  if (!ctx) return { ctx: null, teardown: () => {} };

  // HiDPI 스케일
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = !!smoothing;

  /**
   * @description  요소(canvas)의 크기 변경 감지
   */
  const ro = new ResizeObserver(() => {
    const { cssW, cssH } = measure(canvas);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.width = Math.max(1, Math.round(cssW * dpr));
    canvas.height = Math.max(1, Math.round(cssH * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  });
  ro.observe(canvas);

  return {
    ctx,
    // 감시 종료
    teardown: () => ro.disconnect(),
  };
}

/**
 * @description 뷰 변환(줌/회전/팬) 적용: 모든 레이어에서 동일 호출
 */
function applyView(ctx, view) {
  const dpr = window.devicePixelRatio || 1;
  const cw = ctx.canvas.width / dpr;
  const ch = ctx.canvas.height / dpr;
  const { zoom, rotation, panX, panY } = view;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.translate(cw / 2 + panX, ch / 2 + panY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(zoom, zoom);
  ctx.translate(-cw / 2, -ch / 2);
}

/**
 * @description 좌표 변환: client → 캔버스 로컬 좌표 (뷰 이전)
 */
export function clientToCanvas(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  return { x, y, dpr };
}

/**
 * @description 비트맵 캔버스 설정으로 원본 품질을 유지
 * @option willReadFrequently(자주 계산),
 * @option alpha=false (배경 불투명)
 */
function setupBitmapCanvas(canvas) {
  const dpr = getDPR(Infinity, 1);
  const { ctx, teardown } = setupCanvasBase(canvas, {
    dpr,
    alpha: false,
    contextAttributes: { willReadFrequently: true },
    smoothing: false,
  });
  return { ctx, teardown, dpr };
}

/**
 * @description 비트맵 캔버스 설정으로 원본 품질을 유지
 * @option willReadFrequently(자주 계산),
 * @option alpha=false (배경 불투명)
 * 벡터: 고품질 렌더, 스무딩 on
 */
function setupVectorCanvas(canvas) {
  const dpr = getDPR(Infinity, 1);
  const { ctx, teardown } = setupCanvasBase(canvas, {
    dpr,
    alpha: true,
    smoothing: true,
  });
  return { ctx, teardown, dpr };
}

/**
 * @description 비트맵 캔버스 설정으로 원본 품질을 유지
 * @option willReadFrequently(자주 계산),
 * @option alpha=false (배경 불투명)
 * 오버레이: 경량 프리뷰(대시 라인 등) → DPR 캡으로 비용 절감
 */
function setupOverlayCanvas(canvas, dprCap = 1.5) {
  const dpr = getDPR(dprCap, 1);
  const { ctx, teardown } = setupCanvasBase(canvas, {
    dpr,
    alpha: true,
    smoothing: false,
  });
  if (ctx) {
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1;
    ctx.imageSmoothingEnabled = false;
  }
  return { ctx, teardown, dpr };
}

export const SETUP = {
  getDPR,
  setupBitmapCanvas,
  setupVectorCanvas,
  setupOverlayCanvas,
};
