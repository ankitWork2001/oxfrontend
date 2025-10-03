import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import App from './App';

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppWrapper;
