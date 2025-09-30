/**
 * @file getBitmapHistory.js
 * @author YJH
 */

import { getId } from './get-id';

/**
 * @description 스냅샷 CRUD
 */
const map = new Map();

const getHistory = {
    async capture(canvas) {
        const id = getId();
        const bmp = await createImageBitmap(canvas);
        map.set(id, bmp);
        return id;
    },
    applyTo(id, ctx) {
        const bmp = map.get(id);
        if (!bmp || !ctx) return;
        const { canvas } = ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    },
    get(id) {
        return map.get(id) || null;
    },
    clear() {
        map.clear();
    },
};

function makeVectorSnapshot(state) {
    const s = {};
    for (const k of VECTOR_KEYS) s[k] = state[k];
    return s;
}

const restoreVector = (snapshot) => ({
    type: 'history/RESTORE_VECTOR',
    payload: snapshot,
});

export { getHistory, makeVectorSnapshot, restoreVector };
