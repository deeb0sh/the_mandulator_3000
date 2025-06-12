FROM node:20-alpine

RUN apk update && apk add --no-cache \
    tzdata

RUN ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone

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


#RUN npx prisma generate && npx prisma migrate dev --name init

EXPOSE 3000

CMD [ "node", "src/server.mjs" ]
