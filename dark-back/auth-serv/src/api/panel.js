import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'

export default async function panelApi(fastify) {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET
  })
  // === GET /auth/panel
  fastify.get('/auth/panel', {
    schema: {
      headers: headersJwtValid // схема валидации только хедер с токеном
    }},
    async (request, reply) => {
      try {
        const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
        const login = decod.user
        const roleID = decod.roleID
        console.log(`[PANEL] Пользователь - ${login}, Роль - ${roleID}`)
        // --- только для роли 3
        if (roleID != 3) {
            console.log(`[PANEL] у пользователя ${login} нет прав для получаения списка`)
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
        console.log(`[PANEL] Ошибка - ${err}`)
        return reply.send({ message: "invalid" })
      }
    })
    
}