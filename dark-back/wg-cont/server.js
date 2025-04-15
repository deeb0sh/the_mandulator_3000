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
    // Записываем минимум а запускаем wiregard
    console.log(config)
    exec(`echo "${config}" > /etc/wireguard/wg0.conf && wg-quick up wg0`, (err, stdout, stderr) => {
      if (err) {
        console.error(' Ошибка при применении конфига WireGuard:', stderr)
        return
      }
      console.log('Конфиг применён')
      
      // отправляем информацию серверу а то что минимум готов и принмиаю остальные настройки
      try {
        const serverUrl = `http://localhost:3001/head/start/${server}`
        fetch(serverUrl, {
          method: 'GET'
        })
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



fastify.listen({ port: 3003, host: '0.0.0.0' })
