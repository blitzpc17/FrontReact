import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/Routes';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 

ReactDOM.render(
  <React.StrictMode>
      <Routes />
  </React.StrictMode>,
  document.getElementById('root')
);
