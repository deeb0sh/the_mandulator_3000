export default async function defIp(fastify, serverName) {
    const serverDb = await fastify.prisma.server.findFirst({
        where: { 
            serverName: serverName  // Имя сервера, переданное в функцию
        },
        select: {
            lan: true
        }    
    })
    const serverIp = serverDb.lan.replace(/\/.*/, '')  // Удаляем все после "/"
    let [oc1, oc2, oc3, oc4] = serverIp.split(".").map(Number)
    oc4++
    let ipServ = `${oc1}.${oc2}.${oc3}.${oc4}`
    return ipServ;
}
