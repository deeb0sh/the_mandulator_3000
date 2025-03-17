FROM node:20-alpine

WORKDIR /auth-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate 

EXPOSE 3000

CMD [ "node", "server.js" ]
