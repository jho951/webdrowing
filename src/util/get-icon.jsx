function getIconComponent(name) {
  switch (name) {
    case 'brush':
      return import('../assert/icon/draw.svg')
    default:
      throw new Error(`Unknown icon: ${name}`);
  }
}

export { getIconComponent };
