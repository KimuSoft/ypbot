import { APIGuild } from 'discord-api-types/v10.js'
import { FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { getUserGuild, getUserGuilds } from '../../utils/guilds.js'
import { rpcFetch } from '../../utils/rpc.js'

type BotGuild = {
  id: string
  name: string
}

declare module 'fastify' {
  interface FastifyContext {
    guild: Awaited<ReturnType<typeof getUserGuild>>
  }
}

export const guildRoutes: FastifyPluginAsync = async (server) => {
  server.addHook(
    'onRequest',
    requireAuth(async (req, reply) => {
      const { id } = req.params as { id: string }

      if (id) {
        const guild = await getUserGuild(req, req.user!, id)

        if (!guild) {
          return reply.status(404).send(new Error('Guild not found'))
        }

        req.context.guild = guild
      }
    })
  )

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

  server.get('/:id', (req) => req.context.guild)
}
