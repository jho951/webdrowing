import { useRef } from 'react';
import Bitmap from './bitmap/Bitmap';
import Vector from './vector/Vector';
import Overlay from './overlay/Overlay';
import './dashboard.css';
import Toolbar from '../toolbar/ToolBar';

function DashBoard() {
    const bitmapRef = useRef(null);
    const bitmapCtxRef = useRef(null);
    const vectorRef = useRef(null);
    const vectorCtxRef = useRef(null);
    const overlayRef = useRef(null);

    return (
        <>
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
