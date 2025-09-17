// TypeWrap.jsx
import './typeWrap.css';

const TypeWrap = ({ list, category = '', value, onChange }) => {
  return (
    <section className="type-container" role="group" aria-label={category}>
      {list.map((ele) => {
        const active = value === ele.value;
        return (
          <button
            key={ele.value}
            type="button"
            className={`type-btn ${active ? 'active' : ''}`}
            aria-pressed={active}
            onClick={() => onChange?.(ele.value)}
          >
            {ele.label}
          </button>
        );
      })}
      <span className="type-label">{category}</span>
    </section>
  );
};

export default TypeWrap;
