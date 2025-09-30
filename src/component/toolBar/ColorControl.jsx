/**
 * @file ColorControl.jsx
 * @description 색상 선택 (현재 모드에 맞춰 stroke color 갱신)
 */
import { useDispatch, useSelector } from 'react-redux';
import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { setStrokeColor } from '../../redux/slice/styleSlice';

export default function ColorControl({ colors = [], value = '#000000' }) {
    const dispatch = useDispatch();
    const mode = useSelector(selectGlobalMode);

    const handleColor = (val) => {
        dispatch(setStrokeColor({ mode, color: val }));
    };

    return (
        <div className="toolbar-row">
            <div className="toolbar-field-label">색상</div>
            <div className="toolbar-items color-swatch-list">
                {colors.map((c) => (
                    <button
                        key={c}
                        className={`tb-swatch ${value === c ? 'active' : ''}`}
                        style={{ background: c }}
                        title={c}
                        onClick={() => handleColor(c)}
                    />
                ))}
            </div>
        </div>
    );
}
