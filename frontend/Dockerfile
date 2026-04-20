# Étape 1: Build de l'application React avec Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2: Production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration Nginx simple pour SPA
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

# Script d'injection d'environnement pour OpenStack
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
