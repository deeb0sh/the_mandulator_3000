import sendconf from "../utils/sendconf.js"

export default async function wgServerApi(fastify) {
    // стартовый минимум для работы wg
    fastify.post('/head/start', async (request, reply) => {
        const { server } = request.body
        
        if (!server) {
            return reply.code(400).send({ error: 'Не передано поле server' })
        }
        console.log('подклчился сервер :', server)

        const config = await sendconf(fastify,server)
        return reply.send(config)
    })
    
    fastify.get('/head/start/:server', async (request, reply) => {
        

        const config = await sendconf(fastify,server)
        return reply.send(config)
    })
}