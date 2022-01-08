import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import './index.css';
import App from './app';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

// createStore 만하면 객체만 받을 수 있기 때문에
// promise와 function도 받을 수 있게 promiseMiddleware, ReduxThunk 사용
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={createStoreWithMiddleware(Reducer, // Redux랑 App를 연결시켜주는것
          window.__REDUX_DEVTOOLS_EXTENSION__&&    
          window.__REDUX_DEVTOOLS_EXTENSION__()
       )}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
