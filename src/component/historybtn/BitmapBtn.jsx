import { useEffect, useState } from 'react';
import {
    undoBitmap,
    redoBitmap,
    canUndoBitmap,
    canRedoBitmap,
} from '../../redux/../util/get-history';

export default function BitmapBtn({ ctxRef }) {
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const refresh = () => {
        const ctx = ctxRef?.current;
        setCanUndo(!!ctx && canUndoBitmap(ctx));
        setCanRedo(!!ctx && canRedoBitmap(ctx));
    };

    useEffect(() => {
        refresh();
        const onChange = () => refresh();
        window.addEventListener('bitmap-history-changed', onChange);
        return () =>
            window.removeEventListener('bitmap-history-changed', onChange);
    }, [ctxRef]);

    return (
        <div className="toolbar-group" aria-label="Bitmap history">
            <button
                className="tb-btn"
                disabled={!canUndo}
                onClick={() => {
                    const ctx = ctxRef?.current;
                    if (ctx) undoBitmap(ctx);
                }}
                title="Bitmap Undo"
            >
                ⟲ BMP Undo
            </button>
            <button
                className="tb-btn"
                disabled={!canRedo}
                onClick={() => {
                    const ctx = ctxRef?.current;
                    if (ctx) redoBitmap(ctx);
                }}
                title="Bitmap Redo"
            >
                ⟳ BMP Redo
            </button>
        </div>
    );
}
