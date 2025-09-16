const Select = ({ id, className, label, value, onChange, options = [] }) => {
  return (
    <label htmlFor={id}>
      {label}
      <select id={id} className={className} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value ?? option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
