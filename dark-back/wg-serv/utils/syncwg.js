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
      speed: entry.user?.role?.speed ?? null // безопасный доступ
    }
  })

  try {
    const serverName = {
      RU: 'wgru',
      DE: 'wgde',
      FI: 'wgfi'
    }

    if (!serverName[server]) {
      fastify.log.warn('⚠️ Неизвестный сервер: ' + server)
      return
    }

    const wgUrl = `http://${serverName[server]}:3003/control`

    await fetch(wgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        peers: peers,
        userNet: userNet
      })
    })
  
  } catch (err) {
    fastify.log.error(`❌ Ошибка связи с сервером ${server}:`, err)
    return
  }

  fastify.log.info(`✅ Данные успешно переданы на сервер: ${server}`)
  return
}
