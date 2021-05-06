import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import cssVars from 'css-vars-ponyfill';
import variables from './_utils/colors.json';

/** Подключаем цвета для IE */
cssVars({
  watch: true,
  include: 'style,link[rel="stylesheet"]:not([href*="//"])',
  variables
});

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
