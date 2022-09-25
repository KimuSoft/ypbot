import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { getUserGuilds } from '../../utils/guilds.js'
import { rpc, rpcFetch } from '../../utils/rpc.js'

type BotGuild = {
  id: string
  name: string
}

export const guildRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', requireAuth())

  server.get('/', async (req) => {
    const user = req.user!

    const guilds = await getUserGuilds(req, user)

    const ids = guilds.map((x) => x.id)

    const fetchedGuilds = await rpcFetch<BotGuild[]>('lookupGuilds', ids)

    return guilds.map((x) => {
      const botGuild = fetchedGuilds.find((y) => y.id === x.id)
      if (botGuild) {
        return { ...x, ...botGuild, invited: true }
      }
      return { ...x, invited: false }
    })
  })
}
