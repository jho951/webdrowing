import { dispatchFromCatalogItem } from './dispatcher';

function ToolbarButton({ item }) {
  const handleClick = () => {
    applyCursor(item.cursor || 'default');
    dispatchFromCatalogItem(item);
  };

  return (
    <button onClick={handleClick} title={item.name}>
      {item.icon} {item.name}
    </button>
  );
}

export default ToolbarButton;
