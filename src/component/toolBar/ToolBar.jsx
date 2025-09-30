/**
 * @file ToolBar.js
 * @author YJH
 */
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enterShapeOneShot, setMode } from '../../redux/slice/toolSlice';
import {
  undoBitmap as undo,
  redoBitmap as redo,
} from '../../redux/slice/historySlice';

import { setSelection } from '../../redux/slice/selectSlice';

import { DRAW } from '../../constant/draw';
import { STYLE } from '../../constant/style';

import './toolbar.css';

function ToolBar() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.tool.mode);
  const shape = useSelector((s) => s.tool.shape);
  const color = useSelector((s) => s.selection.color);
  const width = useSelector((s) => s.selection.width);
  const canUndo = useSelector((s) => s.history.canUndo);
  const canRedo = useSelector((s) => s.history.canRedo);

  const TOOL_ITEMS = DRAW.MENU.TOOLBAR.filter(DRAW.isToolOption);
  const SHAPE_ITEMS = DRAW.MENU.TOOLBAR.filter(DRAW.isShapeOption);

  const onPickTool = useCallback((v) => dispatch(setMode(v)), [dispatch]);
  const onPickShape = useCallback(
    (v) => dispatch(enterShapeOneShot(v)),
    [dispatch]
  );
  const onPickColor = useCallback(
    (v) => dispatch(setSelection({ color: v })),
    [dispatch]
  );
  const onPickWidth = useCallback(
    (v) => dispatch(setSelection({ width: v })),
    [dispatch]
  );

  const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
  const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const t = e.target;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      )
        return;

      const opt = DRAW.resolveHotkey(e.key);
      if (opt) {
        e.preventDefault();
        if (DRAW.isToolOption(opt)) onPickTool(opt.value);
        else if (DRAW.isShapeOption(opt)) onPickShape(opt.value);
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.key.toLowerCase() === 'z' && e.shiftKey) ||
        e.key.toLowerCase() === 'y'
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onPickTool, onPickShape, handleUndo, handleRedo]);

  return (
    <header id="header" className="toolbar-wrap">
      <div className="toolbar-left">
        <Section title="도구">
          <ButtonGroup list={TOOL_ITEMS} active={mode} onClick={onPickTool} />
        </Section>
        <Section title="도형(원샷)">
          <ButtonGroup
            list={SHAPE_ITEMS}
            active={shape}
            onClick={onPickShape}
          />
        </Section>
      </div>

      <div className="toolbar-right">
        <Section title="색">
          <ColorGroup
            list={STYLE.ALLOWED_COLOR}
            active={color}
            onClick={onPickColor}
          />
        </Section>
        <Section title="선 두께">
          <WidthGroup
            list={STYLE.ALLOWED_WIDTH}
            active={width}
            onClick={onPickWidth}
          />
        </Section>

        <div className="history-ctrl">
          <button
            className="tool-btn"
            onClick={handleUndo}
            title="되돌리기 (Ctrl+Z)"
            disabled={!canUndo}
          >
            ↶
          </button>
          <button
            className="tool-btn"
            onClick={handleRedo}
            title="다시하기 (Ctrl+Y / Ctrl+Shift+Z)"
            disabled={!canRedo}
          >
            ↷
          </button>
        </div>
      </div>
    </header>
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

export default ToolBar;
