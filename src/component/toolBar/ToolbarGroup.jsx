/**
 * @file ToolbarGroup.jsx
 * @description 카탈로그 그룹(도구/도형/텍스트/이미지/선택) 버튼 렌더
 */
export default function ToolbarGroup({
    title,
    items,
    isItemActive,
    onItemClick,
}) {
    return (
        <div className="toolbar-group">
            <div className="toolbar-title">{title}</div>
            <div className="toolbar-items">
                {!items || items.length === 0 ? (
                    <span className="tb-empty" data-group={title}>
                        항목 없음
                    </span>
                ) : (
                    items.map((item) => (
                        <button
                            key={item.id || `${title}-${item.payload}`}
                            className={`tb-btn ${isItemActive?.(item) ? 'active' : ''}`}
                            title={
                                item.name +
                                (item.shortcut ? ` (${item.shortcut})` : '')
                            }
                            onClick={() => onItemClick?.(item)}
                        >
                            <span className="tb-label">
                                {item.name || String(item.payload)}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
