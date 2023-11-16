FROM node:20.9-bookworm-slim as builder

WORKDIR /app

COPY package*.json .

RUN npm install
#RUN npm ci --omit=dev

COPY ./public ./public
COPY ./src ./src

RUN npm run build





FROM nginx

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .
COPY ./ayts-nginx.conf /etc/nginx/conf.d/default.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
