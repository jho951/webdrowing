import { useDispatch } from 'react-redux';

import { DRAW_TYPE, SHAPE_TYPE } from '../../constant/drawType';

import TypeWrap from '../typeWrap/TypeWrap';
import FileInput from '../fileInput/FileInput';
import ToolStore from '../../redux/slice/toolSlice';

import './toolBar.css';

const ToolBar = () => {
  const dispatch = useDispatch();

  return (
    <nav id="header" className="drawer-toolbar">
      <TypeWrap
        list={DRAW_TYPE}
        category="도구"
        onClick={(e) => dispatch(ToolStore.actions.setTool(e))}
      />
      <TypeWrap list={SHAPE_TYPE} category="도형" />
      <FileInput />
    </nav>
  );
};

export default ToolBar;
