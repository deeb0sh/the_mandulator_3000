import { hashPasswd } from '../utils/hashPasswd.js' // хеширование паролей пользователей 
import { regValid } from '../schemas/regvalid.js' // схема валидации

export default async function regApi(fastify) {
    fastify.post('/auth/reg',{
        schema: {
               body: regValid // схема валидации
            }
        }, 
        async (request, reply) => {
            const { user, password, confirmPassword, inCode } = request.body
            // нужно проверить входящие данные 
    
            const checkInCode = await fastify.prisma.inviteList.findFirst({
                where: {
                    code: {
                        equals: inCode // проверяем инвайт-код с учётом регистра
                    },
                    active: true // если инват активен
               }
            })
    
            if (!checkInCode) {
                return reply.status(400).send({ message: "инвайт-код устарел или его не существует" })
            }
    
            const checkLogin = await fastify.prisma.users.findFirst({
                where: {
                    login: {
                        equals: user.toLowerCase(), // проверяем логины пердварительно переведя символы в нижний регистр
                        mode: 'insensitive'
                    }
                }
            })
    
            if (checkLogin) { // если true воврящаем json с ошибкой
                return reply.status(400).send({ message: "Пользователь с таким именем существует" })
            }
    
            const { hash, salt } = await hashPasswd(password) // получаем hash и salt (соль и спайс)
        
            try {
                await fastify.prisma.users.create({
                    data: { 
                       login: user, 
                       password: hash, 
                       salt: salt,
                       inCodeUsed: inCode // записываем инвайт-код котрый использовал пользователь
                   }
                })
            
                const inv = await fastify.prisma.inviteList.findFirst({
                    where: {
                        code: inCode // проверяем инвайт-код с учётом регистра
                        }
                })
    
                const checkLimit = () => {
                    return inv.used < ( inv.limit - 1 ) // так надо :D
                }
                                         
                if (checkLimit) {
                    await fastify.prisma.inviteList.update({
                        where: {
                            code: inCode, // находим исаользованый инвайт-код в таблице
                            active: true
                        },
                        data: {
                            used: {
                                increment: 1 // увечиливаем значение поля used на 1
                            },
                            updateAt: new Date(), // обновили дату updateAt
                            active: checkLimit() ? inv.active: false // если checkLimit = true тогда поле active
                        }
                    })
                } 
                
                return reply.status(201).send({ message: "ok!" })
            }
            catch(err) {
                return reply.status(500).send({ message: `Ошибка: ${err.message || err.toString()}` })
            }
        })
    
  }
