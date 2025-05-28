FROM node:20-alpine

RUN apk update && apk add --no-cache wireguard-tools tzdata musl-locales musl-locales-lang lang-russian

RUN cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime

RUN rm -r /usr/share/zoneinfo/Africa && \
    rm -r /usr/share/zoneinfo/Antarctica && \
    rm -r /usr/share/zoneinfo/Arctic && \
    rm -r /usr/share/zoneinfo/Asia && \
    rm -r /usr/share/zoneinfo/Atlantic && \
    rm -r /usr/share/zoneinfo/Australia && \
    rm -r /usr/share/zoneinfo/America  && \
    rm -r /usr/share/zoneinfo/Indian && \
    rm -r /usr/share/zoneinfo/Mexico && \
    rm -r /usr/share/zoneinfo/Pacific && \
    rm -r /usr/share/zoneinfo/Chile && \
    rm -r /usr/share/zoneinfo/Canada

RUN echo "Europe/Moscow" >  /etc/timezone

ENV TZ Europe/Moscow

ENV LANG ru_RU.UTF-8

ENV LANGUAGE ru_RU.UTF-8

ENV LC_ALL ru_RU.UTF-8

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
