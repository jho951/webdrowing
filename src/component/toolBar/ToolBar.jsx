/**
 * @file ToolBar.jsx
 * @author YJH
 * @returns
 */
import { useDispatch, useSelector } from 'react-redux';

import { setTool } from '../../redux/slice/toolSlice';
import { setShape } from '../../redux/slice/shapeSlice';
import { setColor } from '../../redux/slice/colorSlice';
import { setWidth } from '../../redux/slice/widthSlice';

import { TOOL } from '../../constant/tool';
import { SHAPE } from '../../constant/shape';
import { COLOR } from '../../constant/color';
import { WIDTH } from '../../constant/width';

import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';

const ToolBar = () => {
  const dispatch = useDispatch();
  // 도구 상태관리
  const activeTool = useSelector((state) => state.tool.activeTool);
  // 도형 상태관리
  const activeShape = useSelector((state) => state.shape.activeShape);
  // 색깔 상태관리
  const activeColor = useSelector((state) => state.color.activeColor);
  // 크기 상태관리
  const activeWidth = useSelector((state) => state.width.activeWidth);

  return (
    <header id="header" className="toolbar-wrap">
      <FileInput />

      {/* 도구 선택 */}
      <TypeWrap
        list={TOOL.ALLOWED_TOOL}
        category="도구"
        value={activeTool.value}
        onChange={(tool) => dispatch(setTool(tool))}
      />

      {/* 도형 선택 */}
      <TypeWrap
        list={SHAPE.ALLOWED_SHAPE}
        category="도형"
        value={activeShape.value}
        onChange={(shape) => dispatch(setShape(shape))}
      />

      {/* 색상 선택 */}
      <TypeWrap
        list={COLOR.ALLOWED_COLOR}
        category="색"
        value={activeColor.value}
        onChange={(color) => dispatch(setColor(color))}
      />

      {/* 크기 선택 */}
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
