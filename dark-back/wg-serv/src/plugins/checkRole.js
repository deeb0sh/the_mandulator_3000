import fastifyPlugin from 'fastify-plugin';

async function checkRole(fastify, options) {
  // Дефолтные параметры для серверов
  const defaultRole = [
    { id: 0, name: "free", speed: 5, network: 30, networkReserv: 28 },
    { id: 1, name: "basic", speed: 50, network: 29, networkReserv: 28 },
    { id: 2, name: "premium", speed: 1000, network: 28, networkReserv: 28 },
    { id: 3, name: "master", speed: 1000, network: 28, networkReserv: 28 },
  ];

  // Проверяем, есть ли уже серверы в базе
  const roleCount = await fastify.prisma.role.count();

  // Если серверов нет, создаём дефолтные
  if (roleCount === 0) {
    for (const role of defaultRole) {
      await fastify.prisma.role.create({
        data: role
      });
      fastify.log.warn(`Роль ${ role.id } успешно создана!`);
    }
  } 
  else {
    fastify.log.warn('Роли уже существуют в базе данных.');
  }
}

export default fastifyPlugin(checkRole);