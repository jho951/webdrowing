import { memo, useCallback } from 'react';
import { Tool } from '@/constant/tool';
import './typeWrap.css';



export type Option<T extends string | number = string> = {
  label: string;
  value: T;
};

type Props<T extends string | number = string> = {
  list: Option<T>[];
  category: string;
  value: Tool
  onChange?: (value: T) => void;
  roleType?: 'radiogroup' | 'tablist' | 'group';
};

function TypeWrapInner<T extends string | number>({
  list,
  category,
  value,
  onChange,
  roleType = 'group',
}: Props<T>) {
  const handleClick = useCallback(
    (v: T) => onChange?.(v),
    [onChange]
  );

  const containerRole =
    roleType === 'radiogroup' ? 'radiogroup'
    : roleType === 'tablist' ? 'tablist'
    : 'group';

  const itemRole =
    roleType === 'radiogroup' ? 'radio'
    : roleType === 'tablist' ? 'tab'
    : 'button';

  return (
    <nav className="type-container" role={containerRole} aria-label={category}>
      {list.map((ele) => {
        const active = value === ele.value;
        return (
          <button
            key={String(ele.value)}
            className={`type-btn ${active ? 'active' : ''}`}
            type="button"
            role={itemRole}
            aria-pressed={itemRole === 'button' ? active : undefined}
            aria-selected={itemRole !== 'button' ? active : undefined}
            onClick={() => handleClick(ele.value)}
          >
            {ele.label}
          </button>
        );
      })}
      <span className="type-label">{category}</span>
    </nav>
  );
}

const TypeWrap = memo(TypeWrapInner) as typeof TypeWrapInner;
export default TypeWrap;
