/**
 * @file Toolbar.jsx
 * @description  툴바
 */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { TOOL } from '../../constant/tool';
import { SHAPE } from '../../constant/shape';
import { TEXT } from '../../constant/text';
import { IMAGE } from '../../constant/image';
import { SELECT } from '../../constant/select';

import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { selectActiveTool } from '../../redux/slice/toolSlice';
import { selectActiveShape } from '../../redux/slice/shapeSlice';

import './toolbar.css';
import { dispatchFromCatalogItem, dispatchFromShortcut } from './dispatcher';

export default function Toolbar() {
  const dispatch = useDispatch();
  const mode = useSelector(selectGlobalMode);
  const tool = useSelector(selectActiveTool);
  const shape = useSelector(selectActiveShape);

  const groups = useMemo(() => {
    const tools = TOOL.TOOLS || [];
    const shapes = SHAPE.SHAPES || [];
    const texts = TEXT.TEXTS || [];
    const images = IMAGE.IMAGES || [];
    const selects = SELECT.SELECTS || [];

    return [
      { key: 'tool', title: '도구', items: tools },
      { key: 'shape', title: '도형', items: shapes },
      { key: 'text', title: '텍스트', items: texts },
      { key: 'image', title: '이미지', items: images },
      { key: 'select', title: '선택', items: selects },
    ];
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (
        e.target &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable)
      ) {
        return;
      }
      dispatchFromShortcut(
        dispatch,
        e.key,
        groups.map((g) => g.items)
      );
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, groups]);

  const isItemActive = (item) => {
    if (item.type === TOOL.TOOL_TYPE)
      return mode === 'tool' && tool === item.payload;
    if (item.type === SHAPE.SHAPE_TYPE)
      return mode === 'shape' && shape === item.payload;
    if (item.type === TEXT.TEXT_TYPE) return mode === 'text';
    if (item.type === IMAGE.IMAGE_TYPE) return mode === 'image';
    if (item.type === SELECT.SELECT_TYPE) return mode === 'select';
    return false;
  };

  return (
    <nav className="toolbar-root">
      {groups.map((group) => (
        <div className="toolbar-group" key={group.key}>
          <div className="toolbar-title">{group.title}</div>
          <div className="toolbar-items">
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`tb-btn ${isItemActive(item) ? 'active' : ''}`}
                title={item.name + (item.shortcut ? ` (${item.shortcut})` : '')}
                onClick={() => dispatchFromCatalogItem(dispatch, item)}
              >
                <span className="tb-icon">{item.icon || '•'}</span>
                <span className="tb-label">{item.name}</span>
                {item.shortcut && <kbd className="tb-kbd">{item.shortcut}</kbd>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Section({ title, children }) {
  return (
    <section className="section">
      <div className="section-title">{title}</div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function ButtonGroup({ list, active, onClick }) {
  return (
    <div className="btn-group">
      {list.map((o) => (
        <button
          key={o.value}
          className={`tool-btn ${active === o.value ? 'active' : ''}`}
          onClick={() => onClick(o.value)}
          title={o.label}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ColorGroup({ list, active, onClick }) {
  return (
    <div className="btn-group">
      {list.map((o) => (
        <button
          key={o.value}
          className={`tool-btn ${active === (o.value || o) ? 'active' : ''}`}
          onClick={() => onClick(o.value || o)}
          title={o.label || o.value}
          style={{ color: o.value || o }}
        />
      ))}
    </div>
  );
}

function WidthGroup({ list, active, onClick }) {
  return (
    <div className="btn-group">
      {list.map((o) => (
        <button
          key={o.value}
          className={`tool-btn thickness ${active === o.value ? 'active' : ''}`}
          onClick={() => onClick(o.value)}
          title={o.label}
          data-width={o.value}
        />
      ))}
    </div>
  );
}
