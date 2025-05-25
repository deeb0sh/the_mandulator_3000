FROM node:20-alpine

RUN apk update && apk add --no-cache wireguard-tools 

WORKDIR /app

COPY package*.json ./

COPY src/ ./src

ENV http_proxy=http://10.4.0.2:3128

ENV https_proxy=http://10.4.0.2:3128

RUN npm install && npm cache clean --force

RUN npx prisma generate

EXPOSE 3001

CMD [ "node", "src/server.mjs" ]
