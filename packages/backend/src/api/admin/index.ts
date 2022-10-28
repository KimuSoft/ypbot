import { indexingRoutes }          from 'backend/src/api/admin/indexing.js'
import { requireAuth }             from 'backend/src/utils/auth.js'
import type { FastifyPluginAsync } from 'fastify'
import { UserFlags }               from 'ypbot-api-types'

export const adminRoutes: FastifyPluginAsync = async (server) => {
  server.addHook(
    'onRequest',
    requireAuth((req, reply) => {
      if (req.user === undefined) throw new Error('user is undefined')
      const flags = req.user.flags
      if ((flags & UserFlags.Admin) !== UserFlags.Admin) {
        return reply.status(401).send(new Error('Missing permissions'))
      }
    })
  )

  await server.register(indexingRoutes)
}
