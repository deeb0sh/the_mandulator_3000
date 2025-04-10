export default async function getUserNetwork(fastify,serverName) {
    try {
        // Получаем все подсети для заданного serverName
        const userAllSubnet = await fastify.prisma.userSubnet.findMany({
            where: {
                serverName: serverName
            },
            select: {
                network: true
            }
        });

        return userAllSubnet; // Возвращаем массив с подсетями
    } catch (e) {
        console.log("E R R O R - ", e);
    }
}