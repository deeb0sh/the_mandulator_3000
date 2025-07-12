FROM node:20-alpine

RUN apk update && apk add --no-cache \
    tzdata \
    bash

RUN ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone

ENV TZ=Europe/Moscow \
    LANG=ru_RU.UTF-8 \
    LC_ALL=ru_RU.UTF-8

WORKDIR /app

COPY package*.json ./

COPY src ./src

COPY ssl.sh .

ENV http_proxy=http://10.4.0.2:3128

ENV https_proxy=http://10.4.0.2:3128

RUN chmod +x ssl.sh && ./ssl.sh && npm install && npm cache clean --force

EXPOSE 4000

CMD [ "node", "src/server.mjs" ]
