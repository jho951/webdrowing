import { useDispatch, useSelector } from 'react-redux';

import {
  resetShapeState,
  selectActiveTool,
  setTool,
} from '../../redux/slice/toolSlice';
import { selectActiveShape, setShape } from '../../redux/slice/shapeSlice';
import { selectActiveColor, setColor } from '../../redux/slice/colorSlice';
import { selectActiveWidth, setWidth } from '../../redux/slice/widthSlice';

import { TOOL } from '../../constant/tool';
import { SHAPE } from '../../constant/shape';
import { COLOR } from '../../constant/color';
import { WIDTH } from '../../constant/width';

import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';

import './toolBar.css';

const ToolBar = () => {
  const dispatch = useDispatch();
  // 도구 상태관리
  const activeTool = useSelector(selectActiveTool);
  // 도형 상태관리
  const activeShape = useSelector(selectActiveShape);
  // 색깔 상태관리
  const activeColor = useSelector(selectActiveColor);
  // 크기 상태관리
  const activeWidth = useSelector(selectActiveWidth);

  return (
    <header id="header" className="drawer-toolbar">
      <FileInput />
      <TypeWrap
        list={TOOL.ALLOWED_TOOL}
        category="도구"
        value={activeTool.value}
        onChange={(tool) => setTool(tool)}
      />
      <TypeWrap
        list={SHAPE.ALLOWED_SHAPE}
        category="도형"
        value={activeShape.value}
        onChange={(shape) => setShape(shape)}
      />
      <TypeWrap
        list={COLOR.ALLOWED_COLOR}
        category="색"
        value={activeColor.value}
        onChange={(color) => dispatch(setColor(color))}
      />
      <TypeWrap
        list={WIDTH.ALLOWED_WIDTH}
        category="크기"
        value={activeWidth.value}
        onChange={(width) => dispatch(setWidth(width))}
      />
    </header>
  );
};

export default ToolBar;
