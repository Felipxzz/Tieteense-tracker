import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavoritosProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FavoritosProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
