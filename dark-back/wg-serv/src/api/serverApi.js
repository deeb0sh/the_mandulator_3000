import sendconf from "../utils/sendconf.js"
import syncwg from '../utils/syncwg.js'

export default async function wgServerApi(fastify) {
    // стартовый минимум для работы wg
    fastify.post('/head/start', async (request, reply) => {
        const { server } = request.body
        
        if (!server) {
            return reply.send({ error: 'Не передано поле server' })
        }
        fastify.log.info(`✅⚠️ Подключился сервер: ${server}`)
        fastify.log.info(`📥 Получен body: ${JSON.stringify(request.body)}`)

        const config = await sendconf(fastify,server)
        return reply.send(config)
    })
    
    fastify.get('/head/start/:server', async (request, reply) => {
        const server = request.params.server
        fastify.log.info(`⚠️ Сервер ${server} - готов к получанию информации о настройках`)
        try {
            await syncwg(fastify,server) // передаём данные WG-серверу пиры и настройки сети
            return fastify.log.info("✅ готово")
        }
        catch (err) {
            return fastify.log.error(`❌ Ошибка при передаче пиров остальных настроек сети : ${err} `)
        }
    })
}