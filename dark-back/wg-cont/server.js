import Fastify from 'fastify'
import { exec } from 'child_process'

const server = process.env.SERVERNAME // берём переменную окружения SERVERNAME=
if (!server) {
  console.log('переменная SERVERNAME пустаня')
}

const fastify = Fastify({ 
  logger: true 
})


  fastify.log.warn(`Отправляем запрос на статовый конфиг , имя сервера : , ${server} ,  <== имя сервера`)
  const response = await fetch('http://wg-serv:3001/head/start',{ //В А Ж Н О локалхост поменят на робей версии и не забыть закрыть доступ с 10.11.х.х
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      server: server 
    })
  })
  fastify.log.warn('Ждм ответ от сервера')
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
PostUp = iptables -t nat -A POSTROUTING -s ${data.lan} -o eth0 -j MASQUERADE 
`.trim()
  console.log(config)
  // Записываем минимум а запускаем wiregard
  exec(`echo "${config}" > /etc/wireguard/wg0.conf && wg-quick up wg0`, 
    (err, stdout, stderr) => {
      if (err) {
        fastify.log.error(`❌ Ошибка при применении конфига WireGuard: ${stderr}`)
        return
      }
      fastify.log.warn('✅ Стартовый конфиг Wireguard сервера получен и применён.')
        // отправляем информацию серверу а то что минимум готов и принмиаю остальные настройки
      //   try {
      //     fastify.log.info('⚠️ говорим серверу наше имя и говорим что готовы получить дальнейшие настройки')
      //     const serverUrl = `http://wg-serv:3001/head/start/${server}` // поменять на имя сервиса
      //     fastify.log.info(server)
      //     fetch(serverUrl)
      //    }
      //    catch (e) {
      //     return fastify.log.error('❌ ОШИБКА отравки GET ', e)
      //   }
      // 
      })
 
   // fastify.log.error('❌ ОШИБКА: сервер не стартовал', err)

 
// fastify.post('/control', async (request, reply) => { // принимаем пиры сети скорость
//   const { peers, userNet } = request.body
//   fastify.log.info('⚠️ Получены пиры и настройки сети:')
//   fastify.log.info('⚠️ Peers:', peers)
//   fastify.log.info('⚠️ UserNet:', userNet)

//   function execShell(cmd) {
//     return new Promise((resolve, reject) => {
//       exec(cmd, (err, stdout, stderr) => {
//         if (err) return reject(stderr)
//         resolve(stdout.trim())
//       })
//     })
//   }
  
//   async function updatePeers() {
//     try {
//       const existingRaw = await execShell('wg show wg0 peers') // извлекаем весь список пиров
//       const existingPeers = existingRaw.split('\n').filter(Boolean) // рабиваем посторочно
  
//       const newPublicKeys = peers.map(p => p.publicKey) // создаём список всех публичных ключей
  
//       // Пиры, которых больше нет → удалить
//       for (const oldKey of existingPeers) {
//         if (!newPublicKeys.includes(oldKey)) {
//           await execShell(`wg set wg0 peer ${oldKey.replace(/"/g, '')} remove`)
//           console.log(`Удалён старый пир ${oldKey.replace(/"/g, '')}`)
//         }
//       }
  
//       // Новые пиры, которых ещё нет → добавить
//       for (const peer of peers) {
//         if (!existingPeers.includes(peer.publicKey)) {
//           const ip32 = peer.ip.trim().replace(/\/\d+$/, '/32')
//           const cmd = `wg set wg0 peer ${peer.publicKey} allowed-ips ${ip32},${peer.ip}`
//           await execShell(cmd)
//           console.log(`Добавлен пир ${peer.name} (${peer.publicKey})`)
//         }
//       }
  
//       console.log('Актуализация пиров завершена')
//     } catch (err) {
//       console.error('Ошибка обновления пиров:', err)
//     }
//   }
  
// TC
//   await execShell('tc qdisc del dev wg0 root').catch(() => {}) // удаляем все правила
//   async function applyTC(userNet) {
//     try {
//       // Удаляем все старые qdisc (если есть)
//       await execShell('tc qdisc del dev wg0 root').catch(() => {})
  
//       // Создаем корневую очередь
//       await execShell('tc qdisc add dev wg0 root handle 1: htb default 12')
//       await execShell('tc class add dev wg0 parent 1: classid 1:1 htb rate 10000mbit') // максимум
  
//       for (let i = 0; i < userNet.length; i++) {
//         const { network, speed } = userNet[i]
//         const classId = 20 + i // уникальный classid для каждого
//         const mbit = `${speed}mbit`
  
//         // Создаем класс с ограничением скорости
//         await execShell(`tc class add dev wg0 parent 1:1 classid 1:${classId} htb rate ${mbit}`)
  
//         // Применяем фильтр для подсети
//         await execShell(`tc filter add dev wg0 protocol ip parent 1:0 prio 1 u32 match ip dst ${network} flowid 1:${classId}`)
  
//         console.log(`Ограничение ${mbit} применено к ${network}`)
//       }
  
//       console.log('Все правила tc применены')
//     } catch (e) {
//       console.error('Ошибка применения tc:', e)
//     }
//   }
  

//   try {
//     await applyTC(userNet)
//     await updatePeers()
//   } catch (e) {
//     console.error('Ошибка :', e)
//   }
//   // iptables и tc

//   return reply.send({ status: 'Настройки получены' })
// 
//})

fastify.listen({ port: 3003, host: '0.0.0.0' })
