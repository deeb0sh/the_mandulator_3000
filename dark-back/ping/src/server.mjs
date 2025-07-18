import fs from "fs"
import Fastify from "fastify"
import fastifyWebsocket from "@fastify/websocket"

const fastify = Fastify({ 
    logger: true,
    https: {
      allowHTTP1: true,
      key: fs.readFileSync('/app/src/ssl/key.pem'),
      cert: fs.readFileSync('/app/src/ssl/cert.pem')
    }
 })

await fastify.register(fastifyWebsocket)

fastify.get('/', { websocket: true }, (connection, req) => {
    //console.log(`[PING] есть подключение`)    
    
    connection.on('message', (message) => {
            const textMessage = message.toString() // Преобразует Buffer в строку String

            if (textMessage === 'ping') {
                const start = process.hrtime()
                connection.send(JSON.stringify({
                    msg: 'pong',
                    sTime: process.hrtime(start)[1] / 1e6,
                    tStamp: Date.now()
                }))
            }
        })    
        connection.on('close', () => {
            //console.log(`[PING] Сессия закрыта`)
        })
    }
)

await fastify.listen({ port: 4000, host: '0.0.0.0' })