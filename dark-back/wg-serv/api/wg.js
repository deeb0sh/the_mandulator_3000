import jwt from '@fastify/jwt'

export default async function wgCreateApi(fastify) {

    fastify.register(jwt,{ // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })
    
    //fastify.post('/wg/check')

}