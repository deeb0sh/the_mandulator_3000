export default async function syncwg(fastify, server) {
  const peers = await fastify.prisma.client.findMany({
    where: { serverName: server },
    select: {
      name: true,
      ip: true,
      publicKey: true,
      user: {
        select: {
          subnets: {
            where: { serverName: server },
            take: 1,
            select: {
              network: true
            }
          }
        }
      }
    }
  })
  
  // делаем плоскую структуру
  const flatPeers = peers.map(p => ({
    name: p.name,
    ip: p.ip,
    publicKey: p.publicKey,
    network: p.user?.subnets?.[0]?.network ?? null
  }))
  
  // console.log(flatPeers)
  
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
  //console.log(userNet)
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
    //console.log('📡📡📡 Пытаемся отправить:', JSON.stringify({ flatPeers, userNet }, null, 2))
    const wgUrl = `http://${serverName[server]}:3003/control`

    await fetch(wgUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        peers: flatPeers,
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
