import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectView } from '../../redux/slice/viewSlice';
import {
  selectTextBoxes,
  updateTextBox,
  selectActiveTextId,
} from '../../redux/slice/textSlice';
import { selectStyleState } from '../../redux/slice/styleSlice';
import { worldToScreen } from '../../canvas/matrix';

export default function TextEditorPortal({ host = document.body, canvasCtx }) {
  const d = useDispatch();
  const view = useSelector(selectView);
  const activeId = useSelector(selectActiveTextId);
  const boxes = useSelector(selectTextBoxes);
  const style = useSelector(selectStyleState).text;
  const [domReady, setDomReady] = useState(false);
  const ref = useRef < HTMLTextAreaElement > null;

  const active = boxes.find((b) => b.id === activeId);
  const visible = Boolean(active && canvasCtx);

  useLayoutEffect(() => setDomReady(true), []);

  useEffect(() => {
    if (!visible || !ref.current || !canvasCtx) return;
    // 스타일 적용
    const ta = ref.current;
    ta.style.position = 'fixed';
    ta.style.zIndex = '1000';
    ta.style.background = 'transparent';
    ta.style.border = '1px dashed #999';
    ta.style.outline = 'none';
    ta.style.resize = 'none';
    ta.style.color = style.color;
    ta.style.fontFamily = style.fontFamily;
    ta.style.fontSize = `${style.fontSize}px`;
    ta.style.fontWeight = style.fontWeight;
    ta.style.lineHeight = String(style.lineHeight);
    ta.style.letterSpacing = `${style.letterSpacing}px`;
    ta.style.textAlign = style.align;
  }, [visible, style, canvasCtx]);

  useEffect(() => {
    if (!visible || !ref.current || !canvasCtx || !active) return;
    const { x, y } = worldToScreen(active.x, active.y, canvasCtx, view);
    const { x: x2, y: y2 } = worldToScreen(
      active.x + active.w,
      active.y + active.h,
      canvasCtx,
      view
    );
    const left = Math.min(x, x2);
    const top = Math.min(y, y2);
    const width = Math.abs(x2 - x);
    const height = Math.abs(y2 - y);

    const ta = ref.current;
    ta.style.left = `${left}px`;
    ta.style.top = `${top}px`;
    ta.style.width = `${Math.max(1, width)}px`;
    ta.style.height = `${Math.max(1, height)}px`;
    ta.value = active.content || '';
    // 포커스/커서
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, [visible, active, view, canvasCtx]);

  const onBlur = () => {
    if (!ref.current || !active) return;
    const content = ref.current.value;
    d(updateTextBox({ ...active, content }));
  };

  if (!domReady || !visible) return null;
  return createPortal(
    <textarea ref={ref} onBlur={onBlur} />,
    host || document.body
  );
}
