import { FastifyPluginAsync } from 'fastify'

import { authRoutes } from './auth/index.js'

export const apiRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => ({ hello: 'world' }))

  server.register(authRoutes, { prefix: '/auth' })
}
