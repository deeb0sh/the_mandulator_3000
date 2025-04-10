export default async function getNetwork(fastify,user,serverName) {
    try {
        const userRoleLimit = await fastify.prisma.users.findUnique({ // узнаём данные роли пользователя
            where: {
                login: user
            },
            select: {
                role: true
            }
        })
        const userNetworkReserv = userRoleLimit.role.networkReserv
        // узнаём подсети сервера
        const serverNetwork = await fastify.prisma.server.findMany({
            select: {
                serverName: true,
                lan: true
            }
        })
        // вычесляем свобдные подсети и назначаем их пользоватеою RU
        const serverMap = new Map(
            serverNetwork.map(server => [server.serverName, server.lan])
        )
        const [ip, mask] = serverMap.get(serverName).split("/");
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
        return allNetworks;
        }
        catch (e) {
            console.log("E R R O R -  ",e)
        }
    }
