export default async function defIp(fastify, serverName) {
    fastify.log.info(`📥 [defIp] Запрос IP для сервера: ${serverName}`)
    const serverDb = await fastify.prisma.server.findFirst({
        where: { 
            serverName: serverName  // Имя сервера, переданное в функцию
        },
        select: {
            lan: true
        }    
    })
    fastify.log.info(`📦 [defIp] Получен LAN из БД: ${serverDb.lan}`)

    const serverIp = serverDb.lan.replace(/\/.*/, '').replace(/"/g, '') // Удаляем все после "/" и все кавычки
    
    fastify.log.info(`🛠️ [defIp] IP без маски и кавычек: ${serverIp}`)
    
    let [oc1, oc2, oc3, oc4] = serverIp.split(".").map(Number)
    oc4++
    let ipServ = `${oc1}.${oc2}.${oc3}.${oc4}`
    fastify.log.info(`✅ [defIp] Сгенерированный IP: ${ipServ}`);
    return ipServ;
}
