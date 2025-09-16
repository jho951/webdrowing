import TOOL_BUTTON from '../../constant/toolButton';

const Header = () => {
  // Todo... 리덕스 상태관리
  return (
    <header>
      <nav>
      {/* Todo... svg 아이콘으로 변경에 ux 향상 */}
      {TOOL_BUTTON.map((button) => (
        <button key={button.id} >
          <span>{button.icon}</span>
          {button.name}
        </button>
      ))}
      </nav>
    </header>
  );
};

export default Header;
