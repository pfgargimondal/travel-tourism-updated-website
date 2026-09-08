import React from 'react';
import ReactDOM from 'react-dom/client';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { FlightFilterProvider } from './context/FlightFilterContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId="570435144670-kjeos1f1hn439m6qn1i6g61cgefh9ie8.apps.googleusercontent.com">
        <BrowserRouter>
          <FlightFilterProvider>
            <App />
          </FlightFilterProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </AuthProvider>
  </React.StrictMode>
);


