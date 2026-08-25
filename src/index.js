import React from 'react';
import ReactDOM from 'react-dom/client';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { FlightFilterProvider } from './context/FlightFilterContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FlightFilterProvider>
        <App />
      </FlightFilterProvider>
    </BrowserRouter>
  </React.StrictMode>
);


