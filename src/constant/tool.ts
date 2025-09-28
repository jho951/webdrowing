// constant/index.ts (또는 네가 쓰는 상수 파일)
export type Tool =
  | 'brush' | 'eraser' | 'text' | 'image'
  | 'circle' | 'rect' | 'line' | 'curve';

export type ToolKind = 'tool' | 'shape';

/** 도구/도형을 구분된 유니온으로 정의 */
export type ToolOption =
  | { kind: 'tool';  value: Exclude<Tool, 'circle' | 'rect' | 'line' | 'curve'>; label: string }
  | { kind: 'shape'; value: Extract<Tool,  'circle' | 'rect' | 'line' | 'curve'>; label: string };

/** 타입 가드 */
export const isToolOption  = (o: ToolOption): o is Extract<ToolOption, { kind: 'tool'  }> => o.kind === 'tool';
export const isShapeOption = (o: ToolOption): o is Extract<ToolOption, { kind: 'shape' }> => o.kind === 'shape';

/** 개별 리스트를 분리해 두면 타입 추론이 더 또렷해짐 */
const TOOL_ITEMS = [
  { kind: 'tool',  value: 'brush',  label: '붓'     },
  { kind: 'tool',  value: 'eraser', label: '지우개' },
  // 필요하면 { kind: 'tool', value: 'text' | 'image' } 등 추가
] as const satisfies readonly ToolOption[];

const SHAPE_ITEMS = [
  { kind: 'shape', value: 'line',   label: '직선'   },
  { kind: 'shape', value: 'circle', label: '원'     },
  { kind: 'shape', value: 'rect',   label: '사각형' },
  { kind: 'shape', value: 'curve',  label: '곡선'   },
] as const satisfies readonly ToolOption[];

/** 합본 */
export const TOOL = Object.freeze({
  INITIAL_TOOL: { kind: 'tool', value: 'brush', label: '붓' } as const,
  ALLOWED_TOOL: [...TOOL_ITEMS, ...SHAPE_ITEMS] as const, // readonly ToolOption[]
});

/** 메뉴 합본 (필요 시 추가 확장) */
export const MENU = Object.freeze({
  TOOL: TOOL.ALLOWED_TOOL,
});
