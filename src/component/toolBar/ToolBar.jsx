import { useDispatch, useSelector } from 'react-redux';
import { selectActiveTool, setTool } from '../../redux/slice/drawSlice';
import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';
import { DRAW } from '../../constant/draw';
import './toolBar.css';
import {
  selectAllowedShapes,
  selectAllowedTools,
} from '../../redux/slice/toolSlice';

const ToolBar = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector(selectActiveTool);
  const tools = useSelector(selectAllowedTools);
  const shapes = useSelector(selectAllowedShapes);

  return (
    <nav id="header" className="drawer-toolbar">
      <TypeWrap
        list={DRAW.allowed.tool}
        category="도구"
        value={activeTool}
        onChange={(v) => dispatch(setTool(v))}
      />
      <TypeWrap
        list={DRAW.allowed.shape}
        category="도형"
        onChange={(shape) => window.__insertShape?.(shape)}
      />
      <FileInput />
    </nav>
  );
};

export default ToolBar;
