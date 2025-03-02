import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { hashPasswd } from './utils/hashPasswd.js'

const prisma = new  PrismaClient()
const fastify = Fastify({
    logger: true
})

fastify.get('/auth', async (request, reply) => {
    return { hello: 'world' }
})

fastify.get('/auth/login', async (request, reply) => {
    const users = await prisma.users.findMany()
    return users;
})

// ЛОГИНИЗАЦИЯ тут
fastify.post('/auth/login', async (request, reply) => {
    const { user, password } = request.body
    return reply.status(200).send({ "message": `name-${user}, passworf-${password}` })
})

// РЕГИСТРАЦИЯ добавляеем пользователя в БД
fastify.post('/auth/reg', async (request, reply) => {
    const { user, password, inCode } = request.body
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
        return reply.status(400).send({ "message": "инвайт-кода не существует" })
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
        const newUser = await prisma.users.create({
            data: { 
               login: user,
               password: hash,
               salt: salt,
               inCode: inCode
           }
        })
        return reply.status(200).send({ "message": "ok!" })
        // сюда пишем alter update incode
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