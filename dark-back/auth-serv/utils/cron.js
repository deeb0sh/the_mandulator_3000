import cron from 'node-cron'

export default function cronDeleteToken(fastify) {
    cron.schedule('*/10 * * * *', async () => { // Запуск каждые 10 минут
        try {
            await fastify.prisma.session.deleteMany({
                where: { 
                    exp: { 
                        lt: new Date() // удаляем старые токены из базы
                    } 
                }
            })
        } 
        catch (err) {
            console.error('Ошибка в cron-задаче:', err)
        }
    })

    fastify.addHook('onClose', (instance, done) => {
        job.stop() // Останавливаем задачу
        done()
    })
}