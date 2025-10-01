/**
 * @file Toolbar.jsx
 * @description 상단 헤더형 툴바(카탈로그 + 스타일) + 전역 단축키 + 히스토리 버튼
 */
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectGlobalMode } from '../../redux/slice/modeSlice';
import { selectActiveTool } from '../../redux/slice/toolSlice';
import { selectActiveShape } from '../../redux/slice/shapeSlice';
import { selectEffectiveStyle } from '../../redux/slice/styleSlice';

import { MODE } from '../../constant/mode';
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

import {
    buildCatalogGroups,
    makeIsItemActive,
    createShortcutHandler,
    getSafeStroke,
    getColorList,
    getWidthList,
} from '../../util/toolbar-helper';

import BitmapUndoRedoControl from '../historybtn/BitmapBtn';
import VectorUndoRedoControl from '../historybtn/VectorBtn';
import './toolbar.css';

function Toolbar({ bitmapCtxRef = null }) {
    const dispatch = useDispatch();
    const mode = useSelector(selectGlobalMode);
    const tool = useSelector(selectActiveTool);
    const shape = useSelector(selectActiveShape);
    const style = useSelector(selectEffectiveStyle);

    // 그룹 빌드 (유틸)
    const groups = useMemo(
        () => buildCatalogGroups({ TOOL, SHAPE, TEXT, IMAGE, SELECT }),
        []
    );

    // 활성 판별 함수 (유틸)
    const isItemActive = makeIsItemActive(
        { MODE, TOOL, SHAPE, TEXT, IMAGE, SELECT },
        () => ({ mode, tool, shape })
    );

    // 스타일 안전 추출 (유틸)
    const { color: currentColor, width: currentWidth } = getSafeStroke(style);

    // 컨트롤 값 목록 (유틸)
    const COLOR_LIST = getColorList(STYLE);
    const WIDTH_LIST = getWidthList(STYLE);

    // 단축키 핸들러 (유틸)
    useEffect(() => {
        const onKeyDown = createShortcutHandler(
            dispatch,
            dispatchFromShortcut,
            groups
        );
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [dispatch, groups]);

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

            <BitmapUndoRedoControl ctxRef={bitmapCtxRef} />
            <VectorUndoRedoControl />

            <ColorControl colors={COLOR_LIST} value={currentColor} />
            <WidthControl widths={WIDTH_LIST} value={currentWidth} />
            {/* <ZoomControl
                    value={zoom}
                    onStep={onStepZoom}
                    onSet={onSetZoom}
                />
                <RotationControl
                    value={rotation}
                    onStep={onStepRotation}
                    onSet={onSetRotation}
                /> */}
        </nav>
    );
}

export default Toolbar;

// // 확대/회전 계산 후 dispatch (유틸 + slice action)
//     const onStepZoom = (delta) => dispatch(setZoom(nextZoom(zoom, delta)));
//     const onSetZoom = (val) => {
//         const next = zoomFromInput(val);
//         if (next != null) dispatch(setZoom(next));
//     };
//     const onStepRotation = (delta) =>
//         dispatch(setRotation(nextRotation(rotation, delta)));
//     const onSetRotation = (val) => {
//         const next = rotationFromInput(val);
//         if (next != null) dispatch(setRotation(next));
//     };
