const STYLE = Object.freeze({
  activeColor: Object.freeze({ value: '#000000', label: 'black' }),
  allowedColor: Object.freeze([
    { value: '#000000', label: 'black' },
    { value: '#FFFFFF', label: 'white' },
    { value: '#FF0000', label: 'red' },
    { value: '#0000FF', label: 'blue' },
    { value: '#00FF00', label: 'green' },
    { value: '#FFFF00', label: 'yellow' },
  ]),

  activeWidth: Object.freeze({ value: 5, label: 'normal' }),
  allowedWidth: Object.freeze([
    { value: 9, label: 'thickest' },
    { value: 7, label: 'thick' },
    { value: 5, label: 'normal' },
    { value: 3, label: 'thin' },
    { value: 1, label: 'thinest' },
  ]),
});

export { STYLE };
