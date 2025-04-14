#!/bin/sh

echo "[+] Запуск WireGuard..."
#wg-quick up /app/wg0.conf

echo "[+] Запуск Fastify API..."
cd /app/app
node server.js
