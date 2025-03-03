import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { hashPasswd, verifyPasswd } from './utils/hashPasswd.js'
import { regValid } from './schemas/regvalid.js' // схема валидации
import ajvErrors from 'ajv-errors' // еррор-плагин
import cors from '@fastify/cors'

const prisma = new  PrismaClient()
const fastify = Fastify({
    logger: true,
    ajv: {
        customOptions: {
            allErrors: true,
            $data: true
        },
        plugins: [ajvErrors]
    }
})

fastify.register(cors,{ // залупа
    origin: false // примаем запросы отовсюду
    //methods: ['GET', 'POST'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    //credentials: true,
})

fastify.get('/', async (request, reply) => {
    reply.send({ message : 'CORS'})
})

// ЛОГИНИЗАЦИЯ тут
fastify.post('/auth/login', async (request, reply) => {
    const { user, password } = request.body
    return reply.status(200).send({ "message": `name-${user}, passworf-${password}` })
    })

// РЕГИСТРАЦИЯ добавляеем пользователя в БД
fastify.post('/auth/reg',{
    schema: {
           body: regValid
        }
    }, 
    async (request, reply) => {
        const { user, password, confirmPassword, inCode } = request.body
        // нужно проверить входящие данные 

        const checkInCode = await prisma.inviteList.findFirst({
            where: {
                code: {
                    equals: inCode // проверяем инвайт-код с учётом регистра
                },
                active: true 
           }
        })

        if (!checkInCode) {
            return reply.status(400).send({ "message": "инвайт-код устарел или его не существует" })
        }

        const checkLogin = await prisma.users.findFirst({
            where: {
                login: {
                    equals: user.toLowerCase(), // проверяем логины пердварительно переведя символы в нижний регистр
                    mode: 'insensitive'
                }
            }
        })

        if (checkLogin) { // если true воврящаем json с ошибкой
            return reply.status(400).send({ "message": "Пользователь с таким именем существует" })
        }

        const { hash, salt } = await hashPasswd(password) // получаем hash и salt (соль и спайс)
    
        try {
            await prisma.users.create({
                data: { 
                   login: user, 
                   password: hash, 
                   salt: salt,
                   inCodeUsed: inCode // записываем инвайт-код котрый использовал пользователь
               }
            })
        
            const inv = await prisma.inviteList.findFirst({
                where: {
                    code: inCode // проверяем инвайт-код с учётом регистра
                    }
            })

            const checkLimit = () => {
                return inv.used < (inv.limit - 1);
            }
            
                       
            if (checkLimit) {
                await prisma.inviteList.update({
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
        
            console.log(inv.used, inv.limit, checkLimit())
            
            return reply.status(201).send({ "message": "ok!" })
        }
        catch(err) {
            return reply.status(500).send({ "message": `Ошибка: ${err.message || err.toString()}` })
        }
    })





const start = async () => {
    try {
      await fastify.listen({ port: 3000 });
      console.log('Сервер запущен на http://localhost:3000');
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
};

start()