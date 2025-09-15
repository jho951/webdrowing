import { CanvasProvider } from './component/canvas/CanvasProvider';
import CanvasControl from './component/canvas/CanvasControl';
import ImageDrawer from './component/canvas/ImageDrawer';

function App() {
  return (
    <CanvasProvider>
      <CanvasControl/>
      <ImageDrawer/>
    </CanvasProvider>
  );
}

export default App;
