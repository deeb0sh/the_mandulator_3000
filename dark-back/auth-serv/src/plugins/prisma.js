import fprisma from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

async function prismaPlugin(fastify) {
    const prisma = new PrismaClient()

    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async () => {
        await prisma.$disconnect()
    })
}

export default fprisma(prismaPlugin)