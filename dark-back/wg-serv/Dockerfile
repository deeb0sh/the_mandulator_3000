FROM node:20-alpine

RUN apk update && apk add --no-cache \
    wireguard-tools \
    tzdata \
    musl-locales \
    musl-locales-lang \
    --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community

RUN cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone

RUN rm -rf /usr/share/zoneinfo/{Africa,Antarctica,Arctic,Asia,Atlantic,Australia,America,Indian,Mexico,Pacific,Chile,Canada}

ENV LANG=ru_RU.UTF-8 \
    LANGUAGE=ru_RU.UTF-8 \
    LC_ALL=ru_RU.UTF-8 \
    TZ=Europe/Moscow

RUN echo "ru_RU.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

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
