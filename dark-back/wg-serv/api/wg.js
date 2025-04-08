import jwt from '@fastify/jwt'

export default async function wgCreateApi(fastify) {

    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })
    
    fastify.get('/wg/check', async(request, reply) => {
            //const token = request.headers.authorization.replace('Bearer ', '') // выпилваем из токена bearer
            try {
                const decod = await request.jwtVerify() //первое валидация токена их хедера
                const user = decod.user // извлекаем логин , дальше будим искать его в таблице лимитов
                return reply.send({ message: "valid" })
            }
            catch {
                //return reply.redirect('/')
                return reply.send({ message: "invalid" })
            }
        }
    )
}