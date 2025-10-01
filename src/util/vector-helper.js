/**
 * @file vector-helpers.js
 * @description 벡터 캔버스 공통 유틸 (줄바꿈, 개별 도형 렌더, 씬 렌더)
 */

// ───────────────────────── 텍스트 줄바꿈 ─────────────────────────
export function wrapLines(ctx, text, maxWidth) {
    if (!ctx || !text) return [''];
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        const m = ctx.measureText(test).width;
        if (m > maxWidth && line) {
            lines.push(line);
            line = w;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

// ───────────────────────── 개별 도형 렌더 ─────────────────────────
export function drawShape(ctx, shape) {
    if (!ctx || !shape) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const strokeStyle = shape.stroke || '#000';
    const lineWidth = Number(shape.lineWidth ?? 2);

    if (shape.type === 'line') {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
    } else if (shape.type === 'rect') {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
        }
        ctx.strokeRect(shape.x, shape.y, shape.w, shape.h);
    } else if (shape.type === 'circle') {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
        if (shape.fill && shape.fill !== 'transparent') {
            ctx.fillStyle = shape.fill;
            ctx.fill();
        }
        ctx.stroke();
    } else if (shape.type === 'curve' && shape.kind === 'quadratic') {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.quadraticCurveTo(shape.cx, shape.cy, shape.x2, shape.y2);
        ctx.stroke();
    } else if (shape.type === 'text') {
        const { x, y, w, h, text = '', style = {} } = shape;

        const fontSize = Number(style.fontSize ?? 16);
        const fontWeight = String(style.fontWeight ?? '400');
        const fontFamily =
            style.fontFamily || 'Pretendard, system-ui, sans-serif';
        const lineHeight = Number(style.lineHeight ?? 1.5);
        const letterSp = Number(style.letterSpacing ?? 0);
        const color = style.color || '#000';
        const align = style.align || 'left';

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'top';

        // clip 사각형
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        const lines = wrapLines(ctx, text, w);
        const dy = fontSize * lineHeight;

        let tx = x;
        if (align === 'center') tx = x + w / 2;
        else if (align === 'right') tx = x + w;

        for (let i = 0; i < lines.length; i++) {
            const ty = y + i * dy;
            if (ty + fontSize > y + h) break;

            if (letterSp && align !== 'right') {
                let cx = tx;
                for (const ch of lines[i]) {
                    ctx.fillText(ch, cx, ty);
                    cx += ctx.measureText(ch).width + letterSp;
                }
            } else {
                ctx.fillText(lines[i], tx, ty);
            }
        }

        ctx.restore();
    }

    ctx.restore();
}

// ───────────────────────── 씬 렌더(전체 지우고 다시 그리기) ─────────────────────────
export function renderScene(ctx, items) {
    if (!ctx) return;
    const canvas = ctx.canvas;

    // 전체 클리어 (기본 좌표계)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 개별 도형 렌더
    for (const it of items || []) drawShape(ctx, it);
}
