FROM node:18.15.0-alpine as build
ARG BACKEND_URL=http://192.168.123.200:8080
ENV VITE_BACKEND_URL=$BACKEND_URL
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

FROM nginx:1.22.1-alpine as app
RUN echo $'server { \n\
  gzip on;\n\
  listen       80; \n\
  listen  [::]:80; \n\
  server_name  localhost; \n\
  \n\
  location / { \n\
  root /usr/share/nginx/html; \n\
  index  index.html; \n\
  try_files $uri $uri/ /index.html; \n\
  } \n\
  \n\
  location @rewrites { \n\
  rewrite ^(.*)$ /index.html last; \n\
  } \n\
  }' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]