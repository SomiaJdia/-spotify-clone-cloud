#!/bin/sh
# Ce script crée un fichier JavaScript contenant les variables d'environnement Docker
# Il sera exécuté au démarrage du conteneur Nginx sur la VM OpenStack.

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  VITE_BACKEND_URL: "${VITE_BACKEND_URL}",
  VITE_MINIO_URL: "${VITE_MINIO_URL}",
  VITE_Keycloak_URL:"${VITE_Keycloak_URL}"
};
EOF
