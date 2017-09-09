import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App';
import Store from './store';
import './assets/styles/styles.css';
import 'react-datetime/css/react-datetime.css';

const StoreInstance = Store();

ReactDOM.render(
  <Provider store={StoreInstance}>
    <App />
  </Provider>,
  document.getElementById('root') || document.createElement('div')
);
