# Dependencias
FROM node:21-alpine3.19 AS deps

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci


# Builder - Construye la aplicación
FROM node:21-alpine3.19 AS build

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_HCAPTCHA_SITE_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_HCAPTCHA_SITE_KEY=$VITE_HCAPTCHA_SITE_KEY

RUN npm run build


# Imagen final de producción
FROM nginx:stable-alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
