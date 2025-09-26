/**
 * @file ToolBar.jsx
 * @author YJH
 * @returns
 */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { setTool } from '@/redux/slice/toolSlice';

import { TOOL } from '@/constant/tool';
import FileInput from '@/component/fileInput/FileInput';

const ToolBar = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector((state: RootState) => state.tool.active);

  return (
    <header id="header" className="toolbar-wrap">
      <FileInput />
      <ul>
        {TOOL.ALLOWED_TOOL.map((ele) => {
          return (
            <li>
              <button
                key={ele.value}
                className={`type-btn ${activeTool === ele.value ? 'active' : ''}`}
                type="button"
                onClick={() => dispatch(setTool(ele.value))}
              >
                {ele.label}
              </button>
            </li>
          );
        })}
        <span className="type-label"></span>
      </ul>

      {/* 도형 선택 */}
      {/* <TypeWrap
        list={SHAPE.ALLOWED_SHAPE}
        category="도형"
        value={activeShape.value}
        onChange={(shape) => dispatch(setShape(shape))}
      /> */}

      {/* 색상 선택 */}
      {/* <TypeWrap
        list={COLOR.ALLOWED_COLOR}
        category="색"
        value={activeColor.value}
        onChange={(color) => dispatch(setColor(color))}
      /> */}

      {/* 크기 선택 */}
      {/* <TypeWrap
        list={WIDTH.ALLOWED_WIDTH}
        category="크기"
        value={activeWidth.value}
        onChange={(width) => dispatch(setWidth(width))}
      /> */}
    </header>
  );
};

export default ToolBar;
