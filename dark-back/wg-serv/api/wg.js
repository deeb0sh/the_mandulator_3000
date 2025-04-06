import jwt from '@fastify/jwt'

export default async function wgCreateApi(fastify) {

    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })
    
    fastify.get('/wg/check', async(request, reply) => {
            const token = request.headers.authorization.replace('Bearer ', '') // выпилваем из токена bearer
            try {
                const decod = await request.jwtVerify()
                const login = request.headers['x-login'] // выпиливаем из хедда логин
                const role = request.headers['x-role'] // выпиливаем из хедда логин

                return reply.send({ message: "valid" })
            }
            catch {
                return reply.send({ message: "invalid" })
            }
        }
    )

}