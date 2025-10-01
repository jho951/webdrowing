/**
 * @file OverlayTextEditor.jsx
 * @description 오버레이용 텍스트 입력 컴포넌트
 */
import { useEffect, useRef, useCallback } from 'react';
import { TEXT } from '../../constant/text';

function TextArea({ rect, initialText = '', stylePreset, onCommit, onClose }) {
    const taRef = useRef(null);
    const committedRef = useRef(false);

    useEffect(() => {
        const el = taRef.current;
        if (!el) return;
        el.value = initialText;
        el.focus();
        const len = el.value.length;
        el.setSelectionRange?.(len, len);
    }, [initialText]);

    const commit = useCallback(() => {
        if (committedRef.current) return;
        committedRef.current = true;
        const text = taRef.current?.value ?? '';
        onCommit?.({
            text,
            rect: { ...rect },
            style: {
                color: stylePreset?.color,
                fontFamily: stylePreset?.fontFamily,
                fontSize: stylePreset?.fontSize,
                fontWeight: stylePreset?.fontWeight,
                lineHeight: stylePreset?.lineHeight,
                letterSpacing: stylePreset?.letterSpacing,
                align: stylePreset?.align,
                underline: stylePreset?.underline,
                italic: stylePreset?.italic,
            },
        });
    }, [rect, onCommit, stylePreset]);

    const cancel = useCallback(() => {
        committedRef.current = true;
        onClose?.();
    }, [onClose]);

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
            return;
        }
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') {
            e.preventDefault();
            commit();
        }
    };

    useEffect(() => {
        const onDocPointerDown = (ev) => {
            const el = taRef.current;
            if (!el) return;
            if (ev.target === el || el.contains(ev.target)) return;
            commit();
        };
        document.addEventListener('pointerdown', onDocPointerDown, true);
        return () =>
            document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [commit]);

    return (
        <textarea
            ref={taRef}
            className="overlay-textarea"
            style={{
                position: 'absolute',
                left: `${rect.x}px`,
                top: `${rect.y}px`,
                width: `${Math.max(TEXT.MIN_W, rect.w)}px`,
                height: `${Math.max(TEXT.MIN_H, rect.h)}px`,
                margin: 0,
                padding: '6px 8px',
                border: '1px solid rgba(0,0,0,0.2)',
                outline: 'none',
                background: 'rgba(255,255,255,0.95)',
                resize: 'both',
                overflow: 'auto',
                zIndex: 1000,
                color: stylePreset?.color || '#000',
                fontFamily:
                    stylePreset?.fontFamily ||
                    'Pretendard, system-ui, sans-serif',
                fontSize: stylePreset?.fontSize
                    ? `${stylePreset.fontSize}px`
                    : '16px',
                fontWeight: stylePreset?.fontWeight || '400',
                lineHeight: stylePreset?.lineHeight || 1.5,
                letterSpacing: stylePreset?.letterSpacing
                    ? `${stylePreset.letterSpacing}px`
                    : 0,
                textAlign: stylePreset?.align || 'left',
            }}
            placeholder="텍스트 입력… (Esc: 취소, ⌘/Ctrl+Enter: 확정)"
            onKeyDown={onKeyDown}
            onBlur={commit}
        />
    );
}

export default TextArea;
