FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=/api
ARG VITE_WHATSAPP_NUMBER=94703280480
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
