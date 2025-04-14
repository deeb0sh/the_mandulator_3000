FROM alpine:latest

RUN apk update && apk add --no-cache \
	bash \
	iproute2 \
	iptables \
	wireguard-tools \
	nodejs \
	npm

WORKDIR /app

COPY . .

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["sh", "/app/start.sh"]
