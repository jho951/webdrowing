import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import App from './App';
import './app.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
