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

RUN npm install && npm cache clean --force

COPY . .

RUN npx prisma generate && npx prisma migrate dev --name init

EXPOSE 3000

CMD [ "node", "server.js" ]
