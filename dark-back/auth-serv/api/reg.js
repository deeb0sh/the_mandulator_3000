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
    
            request.log.info(`Попытка регистрации: login=${user}, inviteCode=${inCode}`) // фиксируем попытку регистрации

            const checkInCode = await fastify.prisma.inviteList.findFirst({
                where: {
                    code: {
                        equals: inCode // проверяем инвайт-код с учётом регистра
                    },
                    active: true // если инват активен
               }
            })
    
            if (!checkInCode) {
                request.log.warn(`Неверный инвайт-код: ${inCode} (мб брут)`) // фиксация неудачного инвайта
                return reply.send({ message: "инвайт-код устарел или его не существует" })
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
                request.log.warn(`Попытка регистрации с уже существующим логином: ${user}`)
                return reply.send({ message: "Пользователь с таким именем существует" })
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
            
                request.log.info(`Пользователь ${user} зарегистрирован, инвайт-код ${inCode} использован`)

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

                    request.log.info(`Инвайт-код ${inCode} теперь использован ${inv.used + 1} раз(а)`)
                } 
                
                return reply.status(201).send({ message: "ok!" })
            }
            catch(err) {
                request.log.error(`Ошибка при регистрации: ${err.message}`)
                return reply.status(500).send({ message: `Ошибка: ${err.message || err.toString()}` })
            }
        })
    
  }
