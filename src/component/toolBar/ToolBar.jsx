/**
 * @file Toolbar.jsx
 * @description 툴바 컨테이너: 카탈로그 그룹 + 스타일 패널 + 전역 단축키
 */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { selectActiveTool } from '../../redux/slice/toolSlice';
import { selectActiveShape } from '../../redux/slice/shapeSlice';
import { selectEffectiveStyle } from '../../redux/slice/styleSlice';

import {
    selectZoom,
    selectRotation,
    setZoom,
    setRotation,
} from '../../redux/slice/sizeSlice';

import { TOOL } from '../../constant/tool';
import { SHAPE } from '../../constant/shape';
import { TEXT } from '../../constant/text';
import { IMAGE } from '../../constant/image';
import { SELECT } from '../../constant/select';
import { STYLE } from '../../constant/style';

import {
    dispatchFromCatalogItem,
    dispatchFromShortcut,
} from '../../util/dispatcher';

import ToolbarGroup from './ToolbarGroup';
import ColorControl from './ColorControl';
import WidthControl from './WidthControl';
import ZoomControl from './ZoomControl';
import RotationControl from './RotationControl';

import './toolbar.css';
import HistoryButtons from '../historybtn/HistoryBtn';

export default function Toolbar() {
    const dispatch = useDispatch();

    // 현재 모드/툴/도형
    const mode = useSelector(selectGlobalMode);
    const tool = useSelector(selectActiveTool);
    const shape = useSelector(selectActiveShape);
    const color = useSelector(selectEffectiveStyle);

    // 스타일(모드에 따라 안전 접근)
    const eff = useSelector(selectEffectiveStyle) || {};
    const currentStroke = eff?.stroke || eff?.tool?.stroke || {};
    const currentColor = currentStroke.color ?? STYLE.INITIAL_COLOR.value;
    const currentWidth = currentStroke.width ?? STYLE.INITIAL_WIDTH.value;

    // 확대/회전
    const zoom = useSelector(selectZoom) ?? 1;
    const rotation = useSelector(selectRotation) ?? 0;

    // 카탈로그 그룹
    const groups = useMemo(
        () => [
            {
                key: 'tool',
                title: '도구',
                items: Array.isArray(TOOL.TOOLS) ? TOOL.TOOLS : [],
            },
            {
                key: 'shape',
                title: '도형',
                items: Array.isArray(SHAPE.SHAPES) ? SHAPE.SHAPES : [],
            },
            {
                key: 'text',
                title: '텍스트',
                items: Array.isArray(TEXT.TEXTS) ? TEXT.TEXTS : [],
            },
            {
                key: 'image',
                title: '이미지',
                items: Array.isArray(IMAGE.IMAGES) ? IMAGE.IMAGES : [],
            },
            {
                key: 'select',
                title: '선택',
                items: Array.isArray(SELECT.SELECTS) ? SELECT.SELECTS : [],
            },
        ],
        []
    );

    // 버튼 active 판정
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
            dispatchFromShortcut(
                dispatch,
                e.key,
                groups.map((g) => g.items)
            );
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [dispatch, groups]);

    const stepZoom = (delta) => {
        const next = Math.max(0.1, Math.min(8, (zoom ?? 1) + delta));
        dispatch(setZoom(next));
    };
    const setZoomExact = (v) => {
        const n = Number(v);
        if (Number.isFinite(n)) {
            const next = Math.max(0.1, Math.min(8, n));
            dispatch(setZoom(next));
        }
    };
    const stepRotation = (delta) => {
        let next = (rotation + delta) % 360;
        if (next < 0) next += 360;
        dispatch(setRotation(next));
    };
    const setRotationExact = (v) => {
        const n = Number(v);
        if (Number.isFinite(n)) {
            let next = n % 360;
            if (next < 0) next += 360;
            dispatch(setRotation(next));
        }
    };

    const COLOR_LIST = STYLE.ALLOWED_COLOR.map((c) => c.value);
    const WIDTH_LIST = STYLE.ALLOWED_WIDTH.map((w) => w.value);

    return (
        <nav className="toolbar-wrap">
            {groups.map((group) => (
                <ToolbarGroup
                    key={group.key}
                    title={group.title}
                    items={group.items}
                    isItemActive={isItemActive}
                    onItemClick={(item) =>
                        dispatchFromCatalogItem(dispatch, item)
                    }
                />
            ))}

            <div className="toolbar-group">
                <div className="toolbar-title">스타일</div>

                <ColorControl colors={COLOR_LIST} value={currentColor} />

                <WidthControl
                    widths={WIDTH_LIST}
                    value={Number(currentWidth)}
                />

                <ZoomControl
                    value={Number(zoom)}
                    onStep={stepZoom}
                    onSet={setZoomExact}
                />

                <RotationControl
                    value={Number(rotation)}
                    onStep={stepRotation}
                    onSet={setRotationExact}
                />
            </div>
        </nav>
    );
}
