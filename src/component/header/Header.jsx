import TOOL_TYPE from '../../constant/toolType';
import Select from '../select/Select';
import './header.css';

const Header = () => {
  const dispatch = ()=>{};

  // Todo... 리덕스 상태관리
  return (
    <nav id="header" className='drawer-toolbar'>
      {/* Todo... svg 아이콘으로 변경에 ux 향상 */}
      <Select options={TOOL_TYPE}/>
      </nav>
  );
};

export default Header;
