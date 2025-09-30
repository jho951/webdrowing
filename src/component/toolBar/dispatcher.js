import { IMAGE } from '../../constant/image';
import { SELECT } from '../../constant/select';
import { SHAPE } from '../../constant/shape';
import { TEXT } from '../../constant/text';
import { TOOL } from '../../constant/tool';
import { setMode } from '../../redux/slice/modeSlice';
import { setShape } from '../../redux/slice/shapeSlice';
import { hydrateFromCatalog } from '../../redux/slice/styleSLice';
import { setTool } from '../../redux/slice/toolSlice';

/**
 * 카탈로그 아이템에 맞춰 모드/값/스타일 프리셋까지 적용
 * - 스타일 프리셋을 카탈로그에 두지 않는다면 hydrateFromCatalog는 생략 가능
 */
export function dispatchFromCatalogItem(dispatch, item) {
  const { type, mode, payload, defaults } = item;

  // (선택) 프리셋이 있다면 스타일에 주입
  if (defaults) {
    dispatch(hydrateFromCatalog({ mode, defaults }));
  }

  switch (type) {
    case TOOL.TOOL_TYPE:
      dispatch(setTool(payload)); // 'brush' | 'eraser'
      dispatch(setMode(TOOL.TOOL_TYPE)); // 'tool'
      return;

    case SHAPE.SHAPE_TYPE:
      dispatch(setShape(payload)); // 'rect' | 'circle' | ...
      dispatch(setMode(SHAPE.SHAPE_TYPE)); // 'shape'
      return;

    case TEXT.TEXT_TYPE:
      dispatch(setMode(TEXT.TEXT_TYPE)); // 'text'
      return;

    case IMAGE.IMAGE_TYPE:
      dispatch(setMode(IMAGE.IMAGE_TYPE)); // 'image'
      return;

    case SELECT.SELECT_TYPE:
      dispatch(setMode(SELECT.SELECT_TYPE)); // 'select'
      return;

    default:
      if (mode) dispatch(setMode(mode));
  }
}

/** 키보드 단축키를 카탈로그에서 찾아 동일한 동작 수행 */
export function dispatchFromShortcut(dispatch, key, catalogs) {
  const k = key.toUpperCase();
  const flat = catalogs.flat();
  const hit = flat.find((it) => it.shortcut && it.shortcut.toUpperCase() === k);
  if (hit) dispatchFromCatalogItem(dispatch, hit);
}

/** 선택적으로 초기값(붓 등)으로 복귀할 때 사용 */
export function activateInitialTool(dispatch) {
  dispatch(setTool(TOOL.INITIAL_TOOL.payload));
  dispatch(setMode(TOOL.TOOL_TYPE));
}
