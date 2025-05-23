export default async function getNetwork(fastify, user, serverName) {
    try {
        fastify.log.info(`📥 [getNetwork] Запрос подсетей для пользователя: ${user}, сервер: ${serverName}`);

        const userRoleLimit = await fastify.prisma.users.findUnique({
            where: {
                login: user
            },
            select: {
                role: true
            }
        });
        fastify.log.info(`📊 [getNetwork] Роль пользователя: ${userRoleLimit.role.name}, размер подсети: /${userRoleLimit.role.networkReserv}`);

        const userNetworkReserv = userRoleLimit.role.networkReserv;

        const serverNetwork = await fastify.prisma.server.findMany({
            select: {
                serverName: true,
                lan: true
            }
        });
        fastify.log.info(`🌐 [getNetwork] Получено конфигураций серверов: ${serverNetwork.length}`);

        const serverMap = new Map(
            serverNetwork.map(server => [server.serverName, server.lan])
        );

        const normalizedServerName = serverName.toUpperCase();
        const rawLan = serverMap.get(normalizedServerName);
        const lan = rawLan.replace(/"/g, "") // удаляем все кавычк обязательно
        fastify.log.info(`🔍 [getNetwork] LAN для сервера ${normalizedServerName}: ${lan}`);
        const [ip, mask] = lan.split("/");
        const serverIpRange = 2 ** (32 - Number(mask));
        const userIpRange = 2 ** (32 - Number(userNetworkReserv));
        const octRange = serverIpRange / 256;

        const [oct1, oct2, oct3] = ip.split(".").map(Number);
        const maxOct = oct3 + octRange;

        const allNetworks = [];
        for (let i = oct3; i < maxOct; i++) {
            for (let oct4 = 0; oct4 < 256; oct4 += userIpRange) {
                allNetworks.push(`${oct1}.${oct2}.${i}.${oct4}/${userNetworkReserv}`);
            }
        }

        fastify.log.info(`✅ [getNetwork] Сгенерировано подсетей: ${allNetworks.length} для сервера ${normalizedServerName}`);
        return allNetworks;
    } catch (e) {
        fastify.log.error(`🔥 [getNetwork] Ошибка при генерации подсетей для ${user} на сервере ${serverName}:`, e);
    }
}
