/**
 * @file overlay-helpers.js
 * @description 오버레이 전용 유틸(UID, 히트테스트, 프리뷰 사각형, 캔버스 클리어 등)
 */

import { TEXT } from '../constant/text';

/**
 * @function hitTestTextShapes
 * @description
 * - 텍스트 도형 히트테스트
 * @param {Array} items
 * @param {{x:number,y:number}} p
 * @returns {object|null}
 */
function hitTestTextShapes(items, p) {
    if (!Array.isArray(items)) return null;
    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (it?.type !== 'text') continue;
        const { x, y, w, h } = it;
        if (p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h) return it;
    }
    return null;
}

/**
 * 드래그 시작/끝 점으로 사각형 계산 + 최소 크기 강제
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} end
 * @param {number} minW
 * @param {number} minH
 * @returns {{x:number,y:number,w:number,h:number}}
 */
function rectFromDrag(start, end, minW = TEXT.MIN_W, minH = TEXT.MIN_H) {
    let x = Math.min(start.x, end.x);
    let y = Math.min(start.y, end.y);
    let w = Math.abs(end.x - start.x);
    let h = Math.abs(end.y - start.y);
    w = Math.max(minW, Math.round(w));
    h = Math.max(minH, Math.round(h));
    return { x, y, w, h };
}

/**
 * 점선 프리뷰 사각형 그리기
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} now
 * @param {Function} withOverlayDesign - getOverlayDesign(ctxRef, cb) 형태의 콜백 래퍼
 * @param {Function} onBefore - 그리기 전 클리어 등 선행 처리 (선택)
 */
function drawDashedRect(ctx, start, now, withOverlayDesign, onBefore) {
    if (!ctx || !start || !now) return;
    onBefore?.(ctx);
    const x = Math.min(start.x, now.x);
    const y = Math.min(start.y, now.y);
    const w = Math.abs(now.x - start.x);
    const h = Math.abs(now.y - start.y);
    withOverlayDesign?.(() => {
        ctx.strokeRect(x, y, w, h);
    });
}

function renderScene(ctx, items) {
    if (!ctx) return;
    const canvas = ctx.canvas;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    for (const it of items || []) drawShape(ctx, it);
}

function drawShape(ctx, shape) {
    if (!ctx || !shape) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (shape.type === 'line') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
    } else if (shape.type === 'rect') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
        }
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'circle') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fill();
        }
        ctx.stroke();
    } else if (shape.type === 'curve' && shape.kind === 'quadratic') {
        ctx.strokeStyle = shape.stroke || '#000';
        ctx.lineWidth = Number(shape.lineWidth ?? 2);
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.quadraticCurveTo(shape.cx, shape.cy, shape.x2, shape.y2);
        ctx.stroke();
    }

    ctx.restore();
}

/**
 * @description 오버레이 점선 디자인 초기화 유틸
 * @param {*} ctxRef
 * @param {*} fn 적용되는 이벤트
 * @returns
 */
function getOverlayDesign(ctxRef, fn) {
    const ctx = ctxRef?.current;
    if (!ctx || typeof fn !== 'function') return;
    ctx.save();
    ctx.setLineDash([TEXT.DRAG_THRESHOLD, TEXT.DRAG_THRESHOLD]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(150, 139, 139)';
    fn();
    ctx.restore();
}

export {
    hitTestTextShapes,
    rectFromDrag,
    renderScene,
    drawDashedRect,
    getOverlayDesign,
};
