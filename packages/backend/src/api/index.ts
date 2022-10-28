import { User, orm }               from '@ypbot/database'
import { adminRoutes }             from 'backend/src/api/admin/index.js'
import { authRoutes }              from 'backend/src/api/auth/index.js'
import { guildRoutes }             from 'backend/src/api/guilds/index.js'
import { rulesRoutes }             from 'backend/src/api/rules/index.js'
import { userRoutes }              from 'backend/src/api/users/index.js'
import { jwtSecret }               from 'backend/src/config.js'
import type { FastifyPluginAsync } from 'fastify'
import jwt                         from 'jsonwebtoken'

export const apiRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => ({ hello: 'world' }))

  server.addHook('onRequest', async (req) => {
    req.em = orm.em.fork()

    try {
      let token = req.headers.authorization

      if (token === undefined) return
      if (!token.startsWith('Bearer ')) return
      token = token.slice('Bearer '.length)

      const data = jwt.verify(token, jwtSecret) as { id: string }

      const UserRepo = req.em.getRepository(User)

      const user = await UserRepo.findOne({ id: data.id })

      req.user = user ?? undefined
    } catch (e) {

    }
  })

  await server.register(userRoutes, { prefix: '/users' })

  await server.register(authRoutes, { prefix: '/auth' })

  await server.register(rulesRoutes, { prefix: '/rules' })

  await server.register(guildRoutes, { prefix: '/guilds' })

  await server.register(adminRoutes, { prefix: '/admin' })
}
