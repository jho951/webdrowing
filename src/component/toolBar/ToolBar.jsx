import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveShape,
  selectActiveTool,
  setShape,
  setTool,
} from '../../redux/slice/drawSlice';
import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';
import { DRAW } from '../../constant/draw';
import { STYLE } from '../../constant/style';
import {
  selectColor,
  selectWidth,
  setColor,
  setWidth,
} from '../../redux/slice/styleSlice';

import './toolBar.css';

const ToolBar = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector(selectActiveTool);
  const activeShape = useSelector(selectActiveShape);
  const activeColor = useSelector(selectColor);
  const activeWidth = useSelector(selectWidth);

  return (
    <header id="header" className="drawer-toolbar">
      <FileInput />
      <TypeWrap
        list={DRAW.allowedTool}
        category="도구"
        value={activeTool}
        onChange={(tool) => dispatch(setTool(tool))}
      />
      <TypeWrap
        list={DRAW.allowedShape}
        category="도형"
        value={activeShape}
        onChange={(shape) => dispatch(setShape(shape))}
      />
      <TypeWrap
        list={STYLE.allowedColor}
        category="색"
        value={activeColor}
        onChange={(color) => dispatch(setColor(color))}
      />
      <TypeWrap
        list={STYLE.allowedWidth}
        category="크기"
        value={activeWidth}
        onChange={(width) => dispatch(setWidth(width))}
      />
    </header>
  );
};

export default ToolBar;
