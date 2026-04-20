import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import keycloak from './keycloak.js'

// Synchronise l'utilisateur avec la base de données après connexion
const syncUserWithDB = async (authenticated) => {
  if (authenticated && keycloak.tokenParsed) {
    const { sub, preferred_username, email } = keycloak.tokenParsed;
    try {
      await fetch('http://localhost:5000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub, username: preferred_username, email })
      });
      console.log('User synced with DB');
    } catch (err) {
      console.error('Failed to sync user with DB:', err);
    }
  }
};

keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false }).then((authenticated) => {
  syncUserWithDB(authenticated);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App authenticated={authenticated} keycloak={keycloak} />
    </React.StrictMode>
  )
}).catch(err => {
  console.error("Keycloak initialization failed", err);
  // Render App anyway to show Home/Error
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App authenticated={false} keycloak={keycloak} />
    </React.StrictMode>
  )
});