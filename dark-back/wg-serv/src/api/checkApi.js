import jwt from '@fastify/jwt'
import { headersJwtValid } from '../schemas/headersJWTvalid.js'
import { loginDelValid } from '../schemas/loginDelValid.js'
import getNetwork from '../utils/getNetwork.js' // генерируем все сети для пользователя
import getUserNetwork from '../utils/getUserNetwork.js' // смотри все сети занетый пользователями
import syncwg from '../utils/syncwg.js'

export default async function wgCheckApi(fastify) {

    fastify.register(jwt, { // регистарция jwt плагина
        secret: process.env.JWT_SECRET // секрет в.env JWT_SECRET=""
    })

    fastify.get('/wg/check', {
        schema: {
                headers: headersJwtValid // валидация хедеров один JWT
            }
        },
        async (request, reply) => {
            try {
                fastify.log.info('🔐 Начинаем проверку /wg/check');
                const decod = await request.jwtVerify() //первое валидация токена их хедера
                const user = decod.user // извлекаем логин , дальше будим искать его в таблице пользователей вг
                const role = decod.role // извлекаем роль

                fastify.log.info(`🧾 Токен валидирован. Пользователь: ${user}, Роль: ${role}`);
                const userCheck = await fastify.prisma.Users.findFirst({ // ищем сопадения имеён в бд если нет то создаём пользвателя
                    where: {
                        login: user
                    },
                    select: {
                        id: true,
                        //role: true
                    }
                })
                if (!userCheck) { // если пользователя нет в бд то создаём его и даём доступ ко всем серверам
                    fastify.log.info(`👤 Новый пользователь: ${user}. Создаём запись...`);
                    const newUser = await fastify.prisma.users.create({
                        data: {
                            login: user,
                            roleId: role
                        },
                    })
                    // узнаём есть ли подсети у пользователя
                    const userSubnets = await fastify.prisma.userSubnet.findMany({
                        where: {
                          userId: newUser.id,  // ID пользователя
                        },
                        select: {
                            serverName: true,
                            network: true
                        }
                    })
                    fastify.log.info(`📡 Подсети у нового пользователя: ${userSubnets.length}`);
                    // если сетей у пользователя нет то начинаем вычеслять и заполнять их
                    if (userSubnets.length === 0) {
                        fastify.log.info('🔍 Получаем доступные подсети...');
                        const allNetRu = await getNetwork(fastify,user,'RU')
                        const allNetDe = await getNetwork(fastify,user,'DE')
                        const allNetFi = await getNetwork(fastify,user,'FI')

                        fastify.log.info(`📦 Сети (все): RU=${allNetRu.length}, DE=${allNetDe.length}, FI=${allNetFi.length}`);
                        const userNetRu = (await getUserNetwork(fastify, 'RU')).map(n => n.network);
                        const userNetDe = (await getUserNetwork(fastify, 'DE')).map(n => n.network);
                        const userNetFi = (await getUserNetwork(fastify, 'FI')).map(n => n.network);

                        fastify.log.info(`🛑 Уже занятые сети: RU=${userNetRu.length}, DE=${userNetDe.length}, FI=${userNetFi.length}`);
                        const freeNetRu = allNetRu.filter(subnet => !userNetRu.includes(subnet))
                        const freeNetDe = allNetDe.filter(subnet => !userNetDe.includes(subnet))
                        const freeNetFi = allNetFi.filter(subnet => !userNetFi.includes(subnet))   
                        fastify.log.info(`✅ Свободные сети: RU=${freeNetRu.length}, DE=${freeNetDe.length}, FI=${freeNetFi.length}`);                    
                        if (freeNetRu.length > 0 || freeNetDe.length > 0 || freeNetFi.length > 0) {
                            await fastify.prisma.userSubnet.createMany({
                                data: [
                                  { userId: newUser.id, serverName: 'RU', network: freeNetRu[0]},
                                  { userId: newUser.id, serverName: 'DE', network: freeNetDe[0]},
                                  { userId: newUser.id, serverName: 'FI', network: freeNetFi[0] }
                                ],
                                skipDuplicates: true
                              });
                              fastify.log.info('🎯 Подсети успешно назначены новому пользователю');
                        } 
                        else  {
                            fastify.log.error("🚫 Нет доступных сетей для назначения");
                            return reply.send({ message: "invalid" , onErr: "Нет свободных сетей" })
                        }
                    fastify.log.info("✅ сети назначены ");
                    }
                }
                // промеряем роль . если роль поменялась то меняем на мандуляторе и отсылаем измеения TC в на wg-точки
                const curentRole = await fastify.prisma.users.findFirst({
                    where: { login: user },
                    select: { roleId: true, }
                })
                if (curentRole.roleId !== role ) {
                    fastify.log.warn(`🔄 Роль пользователя изменилась (${curentRole.roleId} → ${role}), обновляем...`);
                    await fastify.prisma.users.update({
                        where: { login: user },
                        data: { roleId: role }
                    })
                    // await syncwg(fastify, 'RU')
                    // await syncwg(fastify, 'DE')
                    // await syncwg(fastify, 'FI')
                    fastify.log.info(`🔁 Синхронизация WireGuard конфигов для ${loc}`);
                    for (const loc of ['RU', 'DE', 'FI']) {  // ахуеть как чётко
                        await syncwg(fastify, loc)
                    }
                    fastify.log.info(`✅ Синхронизация завершена`);
                }              
                // список всеха клиентов пользователя  (((((( ТОЛЬКО ТУТ ))))))))
                if (!userCheck) { // если пользователя ещё нет в базе тогда ничего не отправляем
                    fastify.log.info('📤 Возвращаем ответ для нового пользователя');
                    return reply.send({ message: "first"}) // можно и не писать это 
                }
                const allClinet = await fastify.prisma.users.findMany({
                    where: {
                        id: userCheck.id
                    },
                    select:{
                        clients: {
                                select: {
                                    id: true,
                                    name: true,
                                    ip: true,
                                    serverName: true
                            }
                        }
                    }
                })
                // if (!allClinet.length || allClinet[0].clients.length === 0) {       
                //     return reply.send({ message: "invalid"});
                // }
                fastify.log.info(`📡 Получены клиенты пользователя: ${allClinet[0]?.clients?.length || 0}`);
                return reply.send({ message: "valid", allClinet })
            }
            catch (err) {
                //return reply.redirect('/')
                fastify.log.error('🔥 ОШИБКА при обработке запроса /wg/check', err);
                return reply.send({ message: "invalid", onErr: "Ошибка на сервера 1", e: err })
            }
        }
    )

    fastify.delete('/wg/check',{
        schema: {
            headers: headersJwtValid, // валидация хедеров один JWT
            body: loginDelValid // валидация login
        }},
        async (request, reply) => {
            try {
                const decod = await request.jwtVerify() // извлекаем токен из хедера и валидируем
                const name = decod.user
                const role = decod.role
                if (role != 3) {
                    console.log(`[CHECK] у пользователя ${name} нет прав для удаления`)
                    return reply.send({ message: 'invalid' })
                }
                const { login } = request.body
                const userID = await fastify.prisma.users.findFirst({
                    where: {
                        name: login
                    },
                    select: {
                        id: true
                    }
                })
                
                await fastify.prisma.Client.deleteMany({
                    where: { userId: Number(userID) }
                })

                await fastify.prisma.UserSubnet.deleteMany({
                    where: { userId: Number(userID) }
                })

                await fastify.prisma.users.deleteMany({
                    where: { id: Number(userID) }
                })
                console.log(`[CHECH] УДАЛЕНО - ${login} !!!`)
                return reply.send({ message: "valid" })
            } 
            catch (err) {
                console.log(`[CHECH] ОШИБКА --- ${err} !!!`)
                return reply.send({ message: "invalid", error: err })
            }
        }
    )
}