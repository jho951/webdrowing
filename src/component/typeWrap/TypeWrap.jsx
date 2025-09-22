import './typeWrap.css';

const TypeWrap = ({ list, category, value, onChange }) => {
  return (
    <nav className="type-container" role="group" aria-label={category}>
      {list.map((ele) => {
        return (
          <button
            key={ele.value}
            className={`type-btn ${value === ele.value ? 'active' : ''}`}
            type="tab"
            onClick={() => onChange?.(ele)}
          >
            {ele.label}
          </button>
        );
      })}
      <span className="type-label">{category}</span>
    </nav>
  );
};

export default TypeWrap;
