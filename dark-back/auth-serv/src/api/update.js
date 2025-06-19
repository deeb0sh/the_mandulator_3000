import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'

export default async function updateApi(fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })
  // === GET /auth/update
  fastify.get('/auth/update', {
    schema: {
      headers: headersJwtValid // схема валидации только хедер с токеном
    }},
    async (request, reply) => {
      try {
        const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
        const login = decod.user
        const role = decod.role
        console.log(`[UPDATE] Пользователь - ${login}, Роль - ${role}`)
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
    
}