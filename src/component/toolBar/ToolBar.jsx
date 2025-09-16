import { useDispatch, useSelector } from 'react-redux';

import { DRAW_TYPE } from '../../constant/drawType';
import Select from '../select/Select';

import ToolStore from '../../redux/slice/toolSlice';

import './toolBar.css';

const ToolBar = () => {
  const dispatch = useDispatch();
  const activeTool = useSelector(ToolStore.selectors.selectActiveTool);

  return (
    <nav id="header" className="drawer-toolbar">
      <Select
        id="tool-select"
        label="도구"
        value={activeTool}
        onChange={(e) => dispatch(ToolStore.actions.setTool(e.target.value))}
        options={DRAW_TYPE}
      />
    </nav>
  );
};

export default ToolBar;
