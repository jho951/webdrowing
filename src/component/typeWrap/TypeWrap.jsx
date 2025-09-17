import { useState } from 'react';
import './typeWrap.css';

const TypeWrap = ({ list, category = '', onClick }) => {
  const [isActive, setIsActive] = useState('');
  const onChangeActiveeState = (e) => {
    console.log(e);
    onClick(e);
    setIsActive(e);
  };

  return (
    <section className="type-container">
      {list.map((ele) => (
        <button
          className={`${isActive === ele.value && 'active'} type-btn`}
          onClick={() => onChangeActiveeState(ele.value)}
          key={ele.value}
          type="button"
        >
          {ele.label}
        </button>
      ))}
      <span className="type-label">{category}</span>
    </section>
  );
};

export default TypeWrap;
