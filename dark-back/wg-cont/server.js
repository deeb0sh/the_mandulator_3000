import Fastify from 'fastify'
import { exec } from 'child_process'

const server = process.env.SERVERNAME
if (!server) {
  console.log('переменная SERVERNAME пустаня')
}

const fastify = Fastify({ logger: true })

// === Получаем стартовый конфиг ===
const response = await fetch('http://wg-serv:3001/head/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ server })
})

fastify.log.warn(`Отправляем запрос на статовый конфиг, имя сервера: ${server}`)
fastify.log.warn('Ждм ответ от сервера')

const data = await response.json()
const [serverIp, mask] = data.lan.split('/')
let [oct1, oct2, oct3, oct4] = serverIp.split('.').map(Number)
oct4++
const wgIp = `${oct1}.${oct2}.${oct3}.${oct4}/${mask}`

const config = `[Interface]
PrivateKey = ${data.privatKey}
Address = ${wgIp}
MTU = 1420
ListenPort = ${data.port}
PostUp = iptables -t nat -A POSTROUTING -s ${data.lan} -o eth1 -j MASQUERADE`.trim()

console.log(config)

exec(`echo "${config}" > /etc/wireguard/wg0.conf && wg-quick up wg0`, (err, stdout, stderr) => {
  if (err) {
    fastify.log.error(`❌ Ошибка при применении конфига WireGuard: ${stderr}`)
    return
  }

  fastify.log.warn('✅ Стартовый конфиг Wireguard сервера получен и применён.')
  try {
    const serverUrl = `http://wg-serv:3001/head/start/${server}`
    fetch(serverUrl)
    fastify.log.info('⚠️ Сообщили серверу, что готовы к дальнейшим настройкам')
  } catch (e) {
    fastify.log.error(`❌ ОШИБКА отравки GET , ${e}`)
  }
})

// === Endpoint: /control ===
fastify.post('/control', async (request, reply) => {
  const { peers, userNet } = request.body

  console.log('⚠️ Получены пиры и настройки сети:')
  console.log('⚠️ Peers:', peers)
  console.log('⚠️ UserNet:', userNet)

  function execShell(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) return reject(stderr)
        resolve(stdout.trim())
      })
    })
  }

  async function updatePeers() {
    try {
      const existingRaw = await execShell('wg show wg0 peers')
      const existingPeers = existingRaw.split('\n').filter(Boolean)
      const newPublicKeys = peers.map(p => p.publicKey)

      // Удаляем старые
      for (const oldKey of existingPeers) {
        if (!newPublicKeys.includes(oldKey)) {
          await execShell(`wg set wg0 peer ${oldKey} remove`)
          console.log(`Удалён старый пир ${oldKey}`)
        }
      }

      // Добавляем новые
      for (const peer of peers) {
        if (!existingPeers.includes(peer.publicKey)) {
          const ip32 = peer.ip.trim().replace(/\/\d+$/, '/32')
          const cmd = `wg set wg0 peer ${peer.publicKey} allowed-ips ${ip32},${peer.network.replace(/"/g, '').trim()}`
          console.log(cmd)
          await execShell(cmd)
          console.log(`Добавлен пир ${peer.name} (${peer.publicKey})`)
        }
      }

      console.log('Актуализация пиров завершена')
    } catch (err) {
      console.error('Ошибка обновления пиров:', err)
    }
  }

  try {
    await updatePeers()
    // await applyTC(userNet) — можно раскомментировать позже
    return reply.send({ status: 'Настройки получены и применены' })
  } catch (e) {
    console.error('Ошибка применения настроек:', e)
    return reply.status(500).send({ error: e.toString() })
  }
})

// Запуск сервера
fastify.listen({ port: 3003, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`🚀 Сервер запущен на ${address}`)
})
