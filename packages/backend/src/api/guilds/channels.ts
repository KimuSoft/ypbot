import { FastifyContext, FastifyPluginAsync } from 'fastify'

import { rpcFetch } from '../../utils/rpc.js'

declare module 'fastify' {
  interface FastifyContext {
    channel: {
      id: string
      name: string
      type: number
    }
  }
}

export const guildChannelsRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', async (req) => {
    const channels = await rpcFetch('lookupGuildChannels', req.context.guild.id)

    return channels
  })

  server.addHook('onRequest', async (req, reply) => {
    const { channelId } = req.params as { channelId: string }

    const channel = await rpcFetch('lookupGuildChannel', req.context.guild.id, channelId)

    if (!channel) return reply.status(404).send(new Error('Channel not found'))

    req.context.channel = channel as FastifyContext['channel']
  })

  server.get('/:channelId', (req) => {
    return req.context.channel
  })
}
