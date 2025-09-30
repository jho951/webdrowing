/**
 * @file text-items.js
 * @author YJH
 * @description 텍스트 모드 카탈로그
 */
import { deepFreeze } from '../util/deep-freeze';
import { getId } from '../util/get-id';

const TEXT_TYPE = 'text';

const TEXTS = deepFreeze([
    {
        id: getId(),
        type: TEXT_TYPE,
        mode: TEXT_TYPE,
        payload: 'textbox',
        name: '텍스트',
        icon: 'text',
        shortcut: 'T',
        cursor: 'text',
        fonts: [
            { label: 'Pretendard', value: 'Pretendard' },
            { label: 'Noto Sans KR', value: 'Noto Sans KR' },
            { label: 'Inter', value: 'Inter' },
            { label: 'Roboto', value: 'Roboto' },
            { label: 'Arial', value: 'Arial' },
        ],
        fontLoading: 'lazy',
    },
]);

export const TEXT = { TEXT_TYPE, TEXTS };
