import { hashPasswd } from '../utils/hashPasswd.js' // хеширование паролей пользователей
import { newpassValid } from '../schemas/newpassValid.js'
import jwt from '@fastify/jwt'

export default async function newpassApi(fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })

  fastify.post('/auth/newpass', {
    schema: {
      body: newpassValid // схема валидации
    }},
    async (request, reply) => {
      try {
        const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
        const login = decod.user
      }
      catch (e) {
        return reply.send({ message: "invalid", error: "ошибка JWT" })
      }

        const { password } = request.body // извлекаем password из тела , если пароля не воспадут то валидатор не пропустит newpassValid
        const { hash, salt } = await hashPasswd(password) // получаем hash и salt (соль и спайс)
        await fastify.prisma.users.update({
          where: {
              login: login
          },
          data: {
              password: hash,
              salt: salt
          }
        })
        fastify.log.info(`Пользователь ${user} обновио пароль`)
        return reply.send({ message: "valid"})            
    })
    
}