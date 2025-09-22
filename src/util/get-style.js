/**
 * @file canvas.js
 * @author YJH
 * @description 좌표 계산 유틸리티
 */

import { COLOR } from '../constant/color';

import { WIDTH } from '../constant/width';

/**
 * 그리기 스타일 적용
 * @param {*} ctx
 * @param {*} style
 */
const applyCtxColor = (ctx, color) => {
  ctx.strokeStyle = color ?? COLOR.INITIAL_COLOR.value;
};

/**
 * 그리기 스타일 적용
 * @param {*} ctx
 * @param {*} style
 */
const applyCtxWidth = (ctx, width) => {
  ctx.lineWidth = width ?? WIDTH.INITIAL_WIDTH.value;
};

export { applyCtxColor, applyCtxWidth };
