FROM node:20-alpine

RUN apk update && apk add --no-cache \
    wireguard-tools \
    tzdata

RUN cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone && \
    apk del tzdata && \
    rm -rf /usr/share/zoneinfo/*

ENV TZ=Europe/Moscow \
    LANG=ru_RU.UTF-8 \
    LC_ALL=ru_RU.UTF-8

WORKDIR /app

COPY package*.json ./

COPY src ./src

COPY prisma ./prisma

ENV http_proxy=http://10.4.0.2:3128

ENV https_proxy=http://10.4.0.2:3128

RUN npm install && npm cache clean --force

RUN npx prisma generate

EXPOSE 3001

CMD [ "node", "src/server.mjs" ]
