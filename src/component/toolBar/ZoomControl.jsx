/**
 * @file ZoomControl.jsx
 * @description 확대/축소 컨트롤
 */
export default function ZoomControl({ value = 1, onStep, onSet }) {
    return (
        <div className="toolbar-row">
            <div className="toolbar-field-label">확대</div>
            <div className="toolbar-items zoom-group">
                <button
                    className="tb-btn"
                    onClick={() => onStep?.(-0.1)}
                    title="축소"
                >
                    −
                </button>
                <input
                    className="tb-number"
                    type="number"
                    min={0.1}
                    max={8}
                    step={0.1}
                    value={Number(value).toFixed(2)}
                    onChange={(e) => onSet?.(e.target.value)}
                />
                <button
                    className="tb-btn"
                    onClick={() => onStep?.(+0.1)}
                    title="확대"
                >
                    +
                </button>
            </div>
        </div>
    );
}
