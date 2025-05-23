import fastifyPlugin from 'fastify-plugin';

async function checkServer(fastify, options) {
  // Дефолтные параметры для серверов
  const defaultServers = [
    { serverName: 'RU', lan: process.env.SERVER_RU_LAN, publicKey: process.env.WG_PUBLIC_KEY_RU, privatKey: process.env.WG_PRIVATE_KEY_RU, port: 51820 },
    { serverName: 'DE', lan: process.env.SERVER_DE_LAN, publicKey: process.env.WG_PUBLIC_KEY_DE, privatKey: process.env.WG_PRIVATE_KEY_DE, port: 51820 },
    { serverName: 'FI', lan: process.env.SERVER_FI_LAN, publicKey: process.env.WG_PUBLIC_KEY_FI, privatKey: process.env.WG_PRIVATE_KEY_FI, port: 51820 }
  ];

  // Проверяем, есть ли уже серверы в базе
  const serversCount = await fastify.prisma.server.count();

  // Если серверов нет, создаём дефолтные
  if (serversCount === 0) {
    for (const server of defaultServers) {
      await fastify.prisma.server.create({
        data: server
      });
      fastify.log.warn(`Сервер ${server.serverName} был успешно создан!`);
    }
  } 
  else {
    fastify.log.warn('Серверы уже существуют в базе данных.');
  }
}

export default fastifyPlugin(checkServer);
