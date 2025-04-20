export default async function getUserNetwork(fastify,serverName) {
    try {
        // Получаем все подсети для заданного serverName
        fastify.log.info(`📥 [getUserNetwork] Запрос подсетей по серверу: ${serverName}`);
        const userAllSubnet = await fastify.prisma.userSubnet.findMany({
            where: {
                serverName: serverName
            },
            select: {
                network: true
            }
        });
        fastify.log.info(`📊 [getUserNetwork] Найдено подсетей: ${userAllSubnet.length} для сервера ${serverName}`);

        return userAllSubnet; // Возвращаем массив с подсетями
    } catch (e) {
        fastify.log.error(`🔥 [getUserNetwork] Ошибка при получении подсетей сервера ${serverName}:`, e);
        return [];
    }
}