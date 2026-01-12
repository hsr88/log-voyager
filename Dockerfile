# Etap 1: Budowanie aplikacji (Node.js)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etap 2: Serwowanie aplikacji (Nginx)
FROM nginx:alpine
# Kopiujemy zbudowane pliki do Nginxa
COPY --from=builder /app/dist /usr/share/nginx/html
# Dodajemy konfigurację dla React Router (opcjonalne, ale dobra praktyka)
RUN echo "server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]