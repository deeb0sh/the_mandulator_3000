import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { authPassValid } from '../schemas/authPassValid.js'
import { hashPasswd } from '../utils/hashPasswd.js' 
import { authRoleValid } from '../schemas/authRoleValid.js'
import { authIdValid } from '../schemas/authIdValid.js'

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
        console.log(`[UPDATE] ОШИБКА --- ${err}`)
        return reply.send({ message: "invalid", error: err})
      }
    }
  )
  
  // === PUT (обновляем роль)
  fastify.put('/auth/update',{
    schema: {
      headers: headersJwtValid, // схема валидации только хедер с токеном
      body: authRoleValid // валидация id роли и id пользователя (uuid)
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
        const { id, newrole } = request.body
        await fastify.prisma.users.update({
          where: {
              id: id
          },
          data: {
              roleID: Number(newrole)
          }
        })
        console.log(`[UPDATE] роль пользователя обновлена`)
        return reply.send({ message: "valid" })
      }
      catch (err) {
        console.log(`[UPDATE] ОШИБКА --- ${err}`)
        return reply.send({ message: "invalid", error: err})
      }
    }
  )

  // === DELETE (удаляем пользователя)
  fastify.delete('/auth/update',{
    schema: {
      headers: headersJwtValid, // схема валидации только хедер с токеном
      body: authIdValid // валидация id роли и id пользователя (uuid)
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
        const { id } = request.body
        // --- сохраняем логин удаляемого пользователя для удаленя его из WG
        const rmLogin = await fastify.prisma.users.findFirst({
          where: {
            id: id
          },
          select: {
            login: true
          }
        })

        await fastify.prisma.inviteList.deleteMany({
          where: { authorID: id }
        })

        await fastify.prisma.session.deleteMany({
          where: { ownerID: id }
        })

        await fastify.prisma.users.deleteMany({
          where: { id: id }
        })

        console.log(`[UPDATE] удалён ${rmLogin} из AuthDB`)
        return reply.send({ message: "valid", login: rmLogin })
      }
      catch (err) {
        console.log(`[UPDATE] ОШИБКА --- ${err}`)
        return reply.send({ message: "invalid", error: err})
      }
    }
  )

}