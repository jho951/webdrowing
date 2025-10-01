import { useDispatch, useSelector } from 'react-redux';
import {
    selectVectorCanUndo,
    selectVectorCanRedo,
} from '../../redux/slice/vectorSlice';
import { undoVector, redoVector } from '../../redux/slice/historyVectorThunks';

function VectorUndoRedoControl() {
    const dispatch = useDispatch();
    const canUndo = useSelector(selectVectorCanUndo);
    const canRedo = useSelector(selectVectorCanRedo);

    return (
        <div className="toolbar-group" aria-label="Vector history">
            <button
                className="tb-btn"
                disabled={!canUndo}
                onClick={() => dispatch(undoVector())}
            >
                ⟲ Vector
            </button>
            <button
                className="tb-btn"
                disabled={!canRedo}
                onClick={() => dispatch(redoVector())}
            >
                ⟳ Vector
            </button>
        </div>
    );
}

export default VectorUndoRedoControl;
