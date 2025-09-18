import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveShape,
  selectActiveTool,
  setShape,
  setTool,
} from '../../redux/slice/drawSlice';
import {
  selectColor,
  selectWidth,
  setColor,
  setWidth,
} from '../../redux/slice/styleSlice';
import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';
import { DRAW } from '../../constant/draw';
import { STYLE } from '../../constant/style';

import './toolBar.css';

const ToolBar = () => {
  const dispatch = useDispatch();
  // 도구 상태관리
  const activeTool = useSelector(selectActiveTool);
  // 도형 상태관리
  const activeShape = useSelector(selectActiveShape);
  // 색깔 상태관리
  const activeColor = useSelector(selectColor);
  // 크기 상태관리
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
