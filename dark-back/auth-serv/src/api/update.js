import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { authPassValid } from '../schemas/authPassValid.js'
import { hashPasswd } from '../utils/hashPasswd.js' 
//import { authRoleValid } from '../schemas/authRoleValid.js'

export default async function updateApi(fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })
  // === GET /auth/update (отдаём список пользователей)
  fastify.get('/auth/update', {
    schema: {
      headers: headersJwtValid // схема валидации только хедер с токеном
    }},
    async (request, reply) => {
      try {
        const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
        const login = decod.user
        const role = decod.role
        //console.log(`[UPDATE] Пользователь - ${login}, Роль - ${role}`)
        // --- только для роли 3
        if (role != 3) {
            console.log(`[UPDATE] у пользователя ${login} нет прав для получаения списка`)
            return reply.send({ message: 'invalid' })
        }
        const authUsers = await fastify.prisma.users.findMany({
            select: {
                id: true,
                login: true,
                roleID: true,
                lastLoginAt: true
            }
        })
        return reply.send({ message: "valid", users: authUsers})            
      }
      catch (err) {
        console.log(`[UPDATE] Ошибка - ${err}`)
        return reply.send({ message: "invalid" })
      }
  })
  
  // === POST (принимаем новый пароль пользователя)
  fastify.post('/auth/update', {
    schema: {
      headers: headersJwtValid, // схема валидации только хедер с токеном
      body: authPassValid // валидация поля id и password
    }},
    async (request, reply) => {
      try {
        const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
        const login = decod.user
        const role = decod.role
        if (role != 3) {
          console.log(`[UPDATE] у пользователя ${login} нет прав для получаения списка`)
          return reply.send({ message: 'invalid' })
        }
        const { id, password } = request.body
        const { hash, salt } = await hashPasswd(password) 
        await fastify.prisma.users.update({
          where: {
              id: id
          },
          data: {
              password: hash,
              salt: salt
          }
        })
        console.log(`[UPDATE] пароль обновлён`)
        return reply.send({ message: "valid" })
      }
      catch (err) {
        return reply.send({ message: "invalid", error: err})
      }
    }
  )
  // === PUT (обновляем роль)

}