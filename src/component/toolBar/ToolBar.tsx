/**
 * @file ToolBar.tsx
 * @author YJH
 */
import { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store/store';
import { setTool } from '../../redux/slice/toolSlice';
import { redo, undo } from '../..//redux/slice/historySlice';

import TypeWrap from '../../component/typeWrap/TypeWrap';
import FileInput from '../../component/fileInput/FileInput';

import { MENU } from '@/constant';


import { isShapeOption, isToolOption, Tool, ToolOption } from '@/constant/tool';




import './ToolBar.css';



const ToolBar = memo(() => {
  const dispatch = useDispatch();
  const activeTool = useSelector((s: RootState) => s.tool.active as Tool);

  const handleChange = useCallback(
    (value: Tool) => {
      dispatch(setTool(value));
    },
    [dispatch]
  );

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);

  const ALL = MENU.TOOL as readonly ToolOption[];

  // ⚠️ 문자열 비교 대신 타입 가드로 안전하게 좁히기
  const TOOL_ITEMS  = ALL.filter(isToolOption);
  const SHAPE_ITEMS = ALL.filter(isShapeOption);

  return (
    <header id="header" className="toolbar-wrap">
      <div className="toolbar-row">
        <FileInput />
        <div className="history-ctrl">
          <button type="button" className="tool-btn" onClick={handleUndo} aria-label="Undo">↶</button>
          <button type="button" className="tool-btn" onClick={handleRedo} aria-label="Redo">↷</button>
        </div>
      </div>

      {/* 도구 */}
      <TypeWrap
        list={TOOL_ITEMS}
        category="도구"
        value={activeTool}
        onChange={handleChange}
      />

      {/* 도형 */}
      <TypeWrap
        list={SHAPE_ITEMS}
        category="도형"
        value={activeTool}
        onChange={handleChange}
      />
    </header>
  );
});

export default ToolBar;
