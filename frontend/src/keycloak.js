import Keycloak from 'keycloak-js';

//on fait conncter notre app avec keycloak

const keycloak = new Keycloak({
    url: window._env_?.VITE_Keycloak_URL,
    realm: 'cloudstream',
    clientId: 'react-client'
});
export default keycloak;