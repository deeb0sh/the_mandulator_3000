FROM node:20-alpine

ENV http_proxy=http://10.4.0.3:3128

ENV https_proxy=http://10.4.0.3:3128

RUN apk update && apk add --no-cache \
    bash \
    iproute2 \
    iptables \
    wireguard-tools \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src/

COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 3003/tcp 51820/udp

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["node", "src/server.mjs"]
