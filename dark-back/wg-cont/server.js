import Fastify from 'fastify';
import { exec } from 'child_process';

// 1. Сразу проверяем переменную окружения при старте
const serverName = process.env.SERVERNAME;
if (!serverName) {
  console.error('❌ SERVERNAME не установлен в переменных окружения!');
  process.exit(1);
}

const fastify = Fastify({
  logger: true
});

// 2. Выносим логику подключения в отдельную функцию
async function setupWireguard(config) {
  return new Promise((resolve, reject) => {
    exec(`echo "${config}" > /etc/wireguard/wg0.conf`, (error) => {
      if (error) return reject(error);
      exec('wg-quick up wg0', (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  });
}

fastify.ready().then(async () => {
  try {
    fastify.log.info(`Отправляем запрос на стартовый конфиг, имя сервера: ${serverName}`);
    
    const response = await fetch('http://wg-serv:3001/head/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ server: serverName })
    });

    const data = await response.json();
    const lan = data.lan.replace(/"/g, '');
    const [serverIp, mask] = lan.split("/");
    let [oct1, oct2, oct3, oct4] = serverIp.split(".").map(Number);
    oct4++;
    const wgIp = `${oct1}.${oct2}.${oct3}.${oct4}/${mask}`;

    const config = `[Interface]
PrivateKey = ${data.privateKey}
Address = ${wgIp}
ListenPort = 51820

[Peer]
PublicKey = ${data.serverPublicKey}
AllowedIPs = 0.0.0.0/0
Endpoint = ${data.serverIp}:51820
PersistentKeepalive = 25`;

    await setupWireguard(config);
    fastify.log.info('WireGuard успешно настроен');

  } catch (error) {
    fastify.log.error('Ошибка при настройке:', error);
    process.exit(1);
  }
});

// Запускаем сервер
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});