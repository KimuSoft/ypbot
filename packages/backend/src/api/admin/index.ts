import { UserFlags } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { indexingRoutes } from './indexing.js'

export const adminRoutes: FastifyPluginAsync = async (server) => {
  server.addHook(
    'onRequest',
    requireAuth((req, reply) => {
      const flags = req.user!.flags
      if ((flags & UserFlags.Admin) !== UserFlags.Admin) {
        return reply.status(401).send(new Error('Missing permissions'))
      }
    })
  )

  await server.register(indexingRoutes)
}
