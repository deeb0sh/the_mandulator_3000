FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npx prisma generate && npx prisma migrate dev --name init

EXPOSE 3000

CMD [ "node", "server.js" ]
