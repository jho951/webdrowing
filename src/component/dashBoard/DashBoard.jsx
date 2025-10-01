/**
 * @file DashBoard.jsx
 * @author YJH
 */
import { useRef } from 'react';
import Bitmap from './bitmap/Bitmap';
import Vector from './vector/Vector';
import Overlay from './overlay/Overlay';

import './dashboard.css';
import Toolbar from '../toolbar/ToolBar';

/**
 * @function DashBoard
 * @description
 * - 3중 레이어로 비트맵, 벡타, 오버레이
 * @returns {canvas}
 */
function DashBoard() {
    const bitmapRef = useRef(null);
    const bitmapCtxRef = useRef(null);
    const vectorRef = useRef(null);
    const vectorCtxRef = useRef(null);
    const overlayRef = useRef(null);

    return (
        <>
            <Toolbar bitmapCtxRef={bitmapCtxRef} />
            <section className="dashboard">
                <Bitmap
                    canvasRef={bitmapRef}
                    onReady={(ctx) => {
                        bitmapCtxRef.current = ctx;
                    }}
                />

                <Vector
                    canvasRef={vectorRef}
                    onReady={(ctx) => {
                        vectorCtxRef.current = ctx;
                    }}
                />
                <Overlay
                    canvasRef={overlayRef}
                    bitmapCanvasRef={bitmapRef}
                    bitmapCtxRef={bitmapCtxRef}
                    vectorCtxRef={vectorCtxRef}
                />
            </section>
        </>
    );
}
export default DashBoard;
