/**
 * @file getBitmapHistory.js
 * @author YJH
 */

let index = 0;
const store = new Map();

/**
 * @description 스냅샷 CRUD
 */
const getBitmapHistory = {
  put: async (canvas) => {
    const bmp = await createImageBitmap(canvas);
    const id = `snap_${++index}`;
    store.set(id, bmp);
    return id;
  },

  get: (id) => store.get(id) || null,

  applyTo: (id, targetCtx) => {
    const bmp = store.get(id);
    if (!bmp) return false;
    targetCtx.setTransform(1, 0, 0, 1, 0, 0);
    targetCtx.clearRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);
    targetCtx.drawImage(bmp, 0, 0);
    return true;
  },

  forget: (ids = []) => ids.forEach((id) => store.delete(id)),
};

export { getBitmapHistory };
