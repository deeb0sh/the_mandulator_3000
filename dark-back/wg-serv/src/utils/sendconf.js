export default async function sendconf(fastify, server) {
    const serverDb = await fastify.prisma.server.findFirst({
        where: {
            serverName: server
        },
        select: {
            lan :true,   // ip + 1
            privatKey: true,
            port: true,
        }
    })
    //return serverDb
    return {
        lan: serverDb.lan.replace(/"/g, ''),
        privatKey: serverDb.privatKey.replace(/"/g, ''),
        port: serverDb.port
      }
        
}