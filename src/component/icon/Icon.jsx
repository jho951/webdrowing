function Icon({ name, size = 24, ...props }) {
  return (
    <img
      src={`./icon/${name}.svg`} 
      width={size}
      height={size}
      alt={`${name} icon`}
      {...props}
    />
  );
}

export default Icon;
