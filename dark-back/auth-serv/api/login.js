import { verifyPasswd } from '../utils/hashPasswd.js'
import { loginValid } from '../schemas/loginvalid.js'

export default async function loginApi(fastify) {
    fastify.post('/auth/login',{
        schema: {
            body: loginValid  // валидация 
        }
    }, 
    async (request, reply) => {
        const { user, password } = request.body

        const userBase = await fastify.prisma.users.findUnique({
            where: {
                login: user
            }
        })

        if (!userBase) {
            reply.status(400).send({ message: "пользователь не найден" })
        }

                //const auth = await verifyPasswd(passwd, hash, salt)

        reply.status(200).send({ message: `name-${userBase}` })
    })
}
