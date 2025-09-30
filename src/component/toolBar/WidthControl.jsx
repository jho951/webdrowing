/**
 * @file WidthControl.jsx
 * @description 선 굵기 선택 (현재 모드에 맞춰 stroke width 갱신)
 */
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { setStrokeWidth } from '../../redux/slice/styleSlice';

export default function WidthControl({ widths = [], value = 3 }) {
    const dispatch = useDispatch();
    const mode = useSelector(selectGlobalMode);

    const handleWidth = (w) => {
        dispatch(setStrokeWidth({ mode, width: w }));
    };

    return (
        <div className="toolbar-row">
            <div className="toolbar-field-label">굵기</div>
            <div className="toolbar-items width-chip-list">
                {widths.map((w) => (
                    <button
                        key={w}
                        className={`tb-width ${Number(value) === w ? 'active' : ''}`}
                        data-width={w}
                        title={`${w}px`}
                        onClick={() => handleWidth(w)}
                    />
                ))}
            </div>
        </div>
    );
}
