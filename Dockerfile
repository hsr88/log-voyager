<<<<<<< HEAD
# Etap 1: Budowanie aplikacji (Node.js)
FROM node:18-alpine as builder
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
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
=======
# Etap 1: Budowanie aplikacji (Node.js)
FROM node:18-alpine as builder
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
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
>>>>>>> 94317b0e0e76f2a10180898e122dcf64a021544e
CMD ["nginx", "-g", "daemon off;"]