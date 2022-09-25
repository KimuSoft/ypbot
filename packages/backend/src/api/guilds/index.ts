import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { getUserGuilds } from '../../utils/guilds.js'

export const guildRoutes: FastifyPluginAsync = async (server) => {
  server.addHook(
    'onRequest',
    requireAuth(() => {})
  )

  server.get('/', async (req) => {
    const user = req.user!

    return getUserGuilds(req, user)
  })
}
