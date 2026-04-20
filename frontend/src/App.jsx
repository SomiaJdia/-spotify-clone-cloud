import React from 'react';
import Home from './components/Home/Home';
import Song from './components/Song/Song';

const App = ({ authenticated, keycloak }) => {
  // SI connecté -> Dashboard (Song), SINON -> Home
  return authenticated ? <Song keycloak={keycloak} /> : <Home />;
};

export default App;