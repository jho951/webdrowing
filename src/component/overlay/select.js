import { Rect, rectFromPoints, rectIntersects } from '../utils/geometry';
import { getHandles, hitHandle, Handle } from './handles';
import { Store } from '@reduxjs/toolkit';
import { setSelectedIds } from '../redux/slice/selectSlice';
import { updateShape, updateShapeTransform } from '../redux/slice/shapeSlice';
import { updateImageTransform } from '../redux/slice/imageSlice';

// 선택/트랜스폼 컨트롤러 (Overlay 안에서 사용)
export class SelectController {
  private store;
  private getVectorBounds: () => Array<{id, bounds, kind};

  constructor(store, getVectorBounds) {
    this.store = store;
    this.getVectorBounds = getVectorBounds;
  }

  marqueeSelect(marquee) {
    const hits = this.getVectorBounds().filter(it => rectIntersects(it.bounds, marquee)).map(it => it.id);
    this.store.dispatch(setSelectedIds(hits));
  }

  drawHandles(ctx, selectionBounds) {
    const handles = getHandles(selectionBounds);
    ctx.save();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;
    // bound box
    ctx.strokeRect(selectionBounds.x, selectionBounds.y, selectionBounds.w, selectionBounds.h);
    // handles
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#3B82F6';
    for (const h of handles) {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    }
    ctx.restore();
    return handles;
  }

  beginTransform(px, py, selectionBounds) {
    const handles = getHandles(selectionBounds);
    const hit = hitHandle(handles, px, py);
    if (hit) return { mode:'handle', handle: hit };
    // 바운즈 내부 드래그 → 이동
    const inside = (px>=selectionBounds.x && py>=selectionBounds.y && px<=selectionBounds.x+selectionBounds.w && py<=selectionBounds.y+selectionBounds.h);
    if (inside) return { mode:'move' };
    return { mode:'none' };
  }

  applyTransform(mode, handle, dx, dy) {
    const state = this.store.getState();
    const ids = state.select.selectedIds || [];

    // move: 위치 이동(예: shape: x+=dx, y+=dy / image: x+=dx, y+=dy / text도 동일)
    if (mode === 'move') {
      const { shape, image, text } = state;
      ids.forEach(id => {
        const s = shape.items.find((x)=>x.id===id);
        if (s) {
          this.store.dispatch(updateShape({ ...s, x: s.x + dx, y: s.y + dy }));
          return;
        }
        const im = image.items.find((x)=>x.id===id);
        if (im) {
          this.store.dispatch(updateImageTransform({ id, transform: { translateX: (im.transform?.translateX||0)+dx, translateY:(im.transform?.translateY||0)+dy } }));
          return;
        }
        const t = text.boxes.find((x)=>x.id===id);
        if (t) {
          this.store.dispatch({ type: 'text/updateTextBox', payload: { ...t, x: t.x + dx, y: t.y + dy } });
        }
      });
      return;
    }

    // handle: 리사이즈(간단하게: se 핸들만 예시)
    if (mode === 'handle' && handle) {
      const { shape, image, text } = state;
      ids.forEach(id => {
        const s = shape.items.find((x)=>x.id===id);
        if (s) {
          let nx = s.x, ny = s.y, nw = s.w, nh = s.h;
          if (handle.id === 'se') { nw = Math.max(1, s.w + dx); nh = Math.max(1, s.h + dy); }
          // 나머지 핸들은 대칭으로 계산
          this.store.dispatch(updateShape({ ...s, x: nx, y: ny, w: nw, h: nh }));
          return;
        }
        const im = image.items.find((x)=>x.id===id);
        if (im) {
          // 이미지도 동일하게 w/h를 갱신한다고 가정(간단 버전)
          const nw = Math.max(1, im.w + dx);
          const nh = Math.max(1, im.h + dy);
          this.store.dispatch({ type: 'image/updateImage', payload: { ...im, w: nw, h: nh }});
          return;
        }
        const t = text.boxes.find((x)=>x.id===id);
        if (t) {
          const nw = Math.max(1, t.w + dx);
          const nh = Math.max(1, t.h + dy);
          this.store.dispatch({ type: 'text/updateTextBox', payload: { ...t, w: nw, h: nh }});
        }
      });
    }
  }
}
