import reactDom from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './redux/store/store';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  const root = reactDom.createRoot(rootEl);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error('앱을 찾을 수 없습니다.');
}
