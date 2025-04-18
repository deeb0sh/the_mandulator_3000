import Fastify from 'fastify'
import { exec } from 'child_process'
import dotenv from 'dotenv' // для понимания .env
dotenv.config()

const fastify = Fastify({ 
  logger: true 
})

fastify.ready().then(async () => {  // ready() выполняется при старте 
  const server = process.env.SERVERNAME // берём имя сервера из .env SERVERNAME=
  console.log('данные конфига получены')
  try {
    const response = await fetch('http://localhost:3001/head/start',{ //В А Ж Н О локалхост поменят на робей версии и не забыть закрыть доступ с 10.11.х.х
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        server: server 
      })
    })
    const data = await response.json() // в ответ получаем минимальный конифига серерва чтобы он включился(пиры будит добалвятся на лету)
    const [ serverIp, mask ] = data.lan.split("/")
    let [oct1, oct2, oct3, oct4] = serverIp.split(".").map(Number)
    oct4++
    const wgIp = `${oct1}.${oct2}.${oct3}.${oct4}/${mask}`
    const config = `[Interface]
PrivateKey = ${data.privatKey}
Address = ${wgIp}
MTU = 1420
ListenPort = ${data.port}
PostUp = iptables -t nat -A POSTROUTING -s ${data.lan} -o eth0 -j MASQUERADE && sysctl -w net.ipv4.ip_forward=1
`.trim()
    console.log(config)
    // Записываем минимум а запускаем wiregard
    exec(`echo "${config}" > /etc/wireguard/wg0.conf && wg-quick up wg0`, 
      (err, stdout, stderr) => {
        if (err) {
          console.error(' Ошибка при применении конфига WireGuard:', stderr)
          return
        }
        console.log('Конфиг применён')
        // отправляем информацию серверу а то что минимум готов и принмиаю остальные настройки
        try {
          const serverUrl = `http://localhost:3001/head/start/${server}` // поменять на имя сервиса
          fetch(serverUrl)
         }
         catch (e) {
          return console.log('ОШИБКА ', e)
        }
      })
  } 
  catch (err) {
    console.log('ОШИБКА: ', err)
  }
  
})

fastify.post('/contol', async (request, reply) => { // принимаем пиры сети скорость
  const { peers, userNet } = request.body
  console.log('Получены пиры и настройки сети:')
  console.log('Peers:', peers)
  console.log('UserNet:', userNet)

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
      const existingRaw = await execShell('wg show wg0 peers') // извлекаем весь список пиров
      const existingPeers = existingRaw.split('\n').filter(Boolean) // рабиваем посторочно
  
      const newPublicKeys = peers.map(p => p.publicKey) // создаём список всех публичных ключей
  
      // Пиры, которых больше нет → удалить
      for (const oldKey of existingPeers) {
        if (!newPublicKeys.includes(oldKey)) {
          await execShell(`wg set wg0 peer ${oldKey} remove`)
          console.log(`Удалён старый пир ${oldKey}`)
        }
      }
  
      // Новые пиры, которых ещё нет → добавить
      for (const peer of peers) {
        if (!existingPeers.includes(peer.publicKey)) {
          const ip32 = peer.ip.trim().replace(/\/\d+$/, '/32')
          const cmd = `wg set wg0 peer ${peer.publicKey} allowed-ips ${ip32},${peer.ip}`
          await execShell(cmd)
          console.log(`Добавлен пир ${peer.name} (${peer.publicKey})`)
        }
      }
  
      console.log('Актуализация пиров завершена')
    } catch (err) {
      console.error('Ошибка обновления пиров:', err)
    }
  }
  
// TC
  await execShell('tc qdisc del dev wg0 root').catch(() => {}) // удаляем все правила
  async function applyTC(userNet) {
    try {
      // Удаляем все старые qdisc (если есть)
      await execShell('tc qdisc del dev wg0 root').catch(() => {})
  
      // Создаем корневую очередь
      await execShell('tc qdisc add dev wg0 root handle 1: htb default 12')
      await execShell('tc class add dev wg0 parent 1: classid 1:1 htb rate 10000mbit') // максимум
  
      for (let i = 0; i < userNet.length; i++) {
        const { network, speed } = userNet[i]
        const classId = 20 + i // уникальный classid для каждого
        const mbit = `${speed}mbit`
  
        // Создаем класс с ограничением скорости
        await execShell(`tc class add dev wg0 parent 1:1 classid 1:${classId} htb rate ${mbit}`)
  
        // Применяем фильтр для подсети
        await execShell(`tc filter add dev wg0 protocol ip parent 1:0 prio 1 u32 match ip dst ${network} flowid 1:${classId}`)
  
        console.log(`Ограничение ${mbit} применено к ${network}`)
      }
  
      console.log('Все правила tc применены')
    } catch (e) {
      console.error('Ошибка применения tc:', e)
    }
  }
  

  try {
    await applyTC(userNet)
    await updatePeers()
  } catch (e) {
    console.error('Ошибка :', e)
  }
  // iptables и tc

  return reply.send({ status: 'Настройки получены' })
})

fastify.listen({ port: 3003, host: '0.0.0.0' })
