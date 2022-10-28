import { guildChannelsRoutes }         from 'backend/src/api/guilds/channels.js'
import { requireAuth }                 from 'backend/src/utils/auth.js'
import { getUserGuild, getUserGuilds } from 'backend/src/utils/guilds.js'
import { rpcFetch }                    from 'backend/src/utils/rpc.js'
import type { FastifyPluginAsync }     from 'fastify'

interface BotGuild {
  id: string
  name: string
}

declare module 'fastify' {
  interface FastifyContext {
    guild: NonNullable<Awaited<ReturnType<typeof getUserGuild>>>
  }
}

export const guildRoutes: FastifyPluginAsync = async (server) => {
  server.addHook(
    'onRequest',
    requireAuth(async (req, reply) => {
      if (req.user === undefined) throw new Error('user is undefined')

      const { id } = req.params as { id: string }

      if (typeof id === 'string') {
        const guild = await getUserGuild(req, req.user, id)

        if (guild == null) return await reply.status(404).send(new Error('Guild not found'))

        req.context.guild = guild
      }
    })
  )

  server.get('/', async (req) => {
    if (req.user === undefined) throw new Error('user is undefined')

    const user = req.user

    const guilds = await getUserGuilds(req, user)

    const ids = guilds.map((x) => x.id)

    const fetchedGuilds = await rpcFetch<BotGuild[]>('lookupGuilds', ids)

    return guilds.map((x) => {
      const botGuild = fetchedGuilds.find((y) => y.id === x.id)
      if (botGuild != null) return { ...x, ...botGuild, invited: true }

      return { ...x, invited: false }
    })
  })

  server.get('/:id', (req) => req.context.guild)

  await server.register(guildChannelsRoutes, { prefix: '/:id/channels' })
}
