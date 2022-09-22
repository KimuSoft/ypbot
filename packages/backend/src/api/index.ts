import { UserRepo } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'
import jwt from 'jsonwebtoken'

import { jwtSecret } from '../config.js'
import { authRoutes } from './auth/index.js'
import { userRoutes } from './users/index.js'

export const apiRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => ({ hello: 'world' }))

  server.addHook('onRequest', async (req) => {
    try {
      let token = req.headers.authorization

      if (!token) return
      if (!token.startsWith('Bearer ')) return
      token = token.slice('Bearer '.length)

      const data = jwt.verify(token, jwtSecret) as { id: string }

      const user = await UserRepo.findOne({ where: { id: data.id } })

      req.user = user ?? undefined
    } catch (e) {
      return
    }
  })

  server.register(userRoutes, { prefix: '/users' })

  server.register(authRoutes, { prefix: '/auth' })
}
