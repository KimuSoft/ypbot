import { User, orm } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'
import jwt from 'jsonwebtoken'

import { jwtSecret } from '../config.js'
import { adminRoutes } from './admin/index.js'
import { authRoutes } from './auth/index.js'
import { guildRoutes } from './guilds/index.js'
import { rulesRoutes } from './rules/index.js'
import { userRoutes } from './users/index.js'

export const apiRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => ({ hello: 'world' }))

  server.addHook('onRequest', async (req) => {
    req.em = orm.em.fork()

    try {
      let token = req.headers.authorization

      if (!token) return
      if (!token.startsWith('Bearer ')) return
      token = token.slice('Bearer '.length)

      const data = jwt.verify(token, jwtSecret) as { id: string }

      const UserRepo = req.em.getRepository(User)

      const user = await UserRepo.findOne({ id: data.id })

      req.user = user ?? undefined
    } catch (e) {
      return
    }
  })

  await server.register(userRoutes, { prefix: '/users' })

  await server.register(authRoutes, { prefix: '/auth' })

  await server.register(rulesRoutes, { prefix: '/rules' })

  await server.register(guildRoutes, { prefix: '/guilds' })

  await server.register(adminRoutes, { prefix: '/admin' })
}