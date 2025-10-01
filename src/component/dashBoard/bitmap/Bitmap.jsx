import { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setupCanvas } from '../../../util/canvas-helper';
import {
    pushPastBitmap,
    clearBitmapHistory,
} from '../../../redux/slice/historySlice';
import { commitBitmap } from '../../../redux/slice/bitmapSlice';

function Bitmap({ canvasRef, onReady }) {
    const teardownRef = useRef(null);
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        if (!canvasRef?.current) return;

        const canvas = canvasRef.current;
        const host = canvas.parentElement;

        const captureNow = () => {
            const ctx0 = canvas.getContext('2d');
            if (!canvas || !ctx0) return null;
            return ctx0.getImageData(0, 0, canvas.width, canvas.height);
        };

        const { ctx, teardown } = setupCanvas(canvas, {
            smoothing: false,
            preserve: true,
            maxDpr: 3,
            willReadFrequently: true,
            observeTarget: host,
            onResize: () => {
                const snap = captureNow();
                if (!snap) return;
                dispatch(clearBitmapHistory());
                dispatch(pushPastBitmap({ snapshot: snap }));
                dispatch(commitBitmap({ snapshot: snap }));
            },
        });

        teardownRef.current = teardown;

        onReady?.(ctx);
        const first = captureNow();
        if (first) {
            dispatch(clearBitmapHistory());
            dispatch(pushPastBitmap({ snapshot: first }));
            dispatch(commitBitmap({ snapshot: first }));
        }

        return () => teardownRef.current?.();
    }, [canvasRef, onReady, dispatch]);

    return <canvas className="bitmap" ref={canvasRef} />;
}
export default Bitmap;
