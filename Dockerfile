# Usamos la 22-alpine: Es la versión más moderna con soporte a largo plazo
# Esto garantiza que tu build sea estable por años.
FROM node:22-alpine AS build

WORKDIR /app

# Al usar Node 25 en tu Mac, tu package-lock.json es compatible 
# con Node 22 sin problemas.
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de Nginx (se mantiene igual, es ultra ligera)
# Etapa 2: Nginx
FROM nginx:stable-alpine
# Copiamos tu config personalizado al lugar donde Nginx lo busca
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]