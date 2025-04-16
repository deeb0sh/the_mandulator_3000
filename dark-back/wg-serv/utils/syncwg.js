
export default async function syncwg(fastify, server) {
        const peers = await fastify.prisma.client.findMany({
            where: { serverName: server },
            select: {
                name: true,
                ip: true,
                publicKey: true,
            }
        })

        const userNetdb = await fastify.prisma.userSubnet.findMany({
            where: { serverName: server },
            select: {
              network: true,
              user: {
                select: {
                  role: {
                    select: {
                      speed: true
                    }
                  }
                }
              }
            }
          })
        
        const userNet = userNetdb.map(entry => {
            return {
              network: entry.network,
              speed: entry.user?.role?.speed ?? null  // безопасный доступ, если вдруг роль пустая
            }
          })
        try {
            const serverName = {
                RU: 'wgru',
                DE: 'wgde',
                FI: 'wgfi'
            }
            if (!serverName[server]) {
                console.log('неизвестный сервер')
                return
            }
            //const wgUrl = `http://${serverName[server]}:3003/control` // вставить на в фетч в рабочим варианте
            await fetch('http://localhost:3003/contol', { //  отдаём вг-севреру информацию о сетях / скорости / пиры
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  peers: peers,
                  userNet: userNet
                })
            })
            console.log('данный настройки отпрвелны на ==> ', server)
        }
        catch (err) {
            return console.log('ОШИБКА ! НЕТ СВЯЗИ С СЕРВЕРОМ :', err)
        }
        return console.log("данные отправлены на ", server)
}
