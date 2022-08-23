import React from 'react';
import ReactDOM from 'react-dom/client';
import './fonts/Nunito/Nunito-VariableFont_wght.ttf';
import './fonts/fontawesome/css/all.min.css';
import 'antd/dist/antd.css';
import './style/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
