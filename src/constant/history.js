const UNDO = 'history/UNDO';
const REDO = 'history/REDO';
const undo = () => ({ type: UNDO });
const redo = () => ({ type: REDO });

const HISTORY_TRACK_TARGET = new Set([
  'shape/addShape',
  'text/addTextBox',
  'text/updateTextBox',
  'image/placeImage',
  'bitmap/commitBitmap',
  'style/setStrokeColor',
  'style/setStrokeWidth',
  'style/setStrokeDash',
  'style/setFillColor',
  'style/setFillOpacity',
]);

export const history = { undo, redo, HISTORY_TRACK_TARGET };
