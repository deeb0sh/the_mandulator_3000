import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new  PrismaClient()
const fastify = Fastify({
    logger: true
})

fastify.get('/auth', async (request, reply) => {
    return { hello: 'world' }
})

fastify.get('/auth/login', async (request, reply) => {
    const users = await prisma.user.findMany()
    return users;
})

fastify.post('/api/reg', async (request, reply) => {
    const { email, name } = request.body
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
        }
    })
    return newUser
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