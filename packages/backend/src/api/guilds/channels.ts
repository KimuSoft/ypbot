import { FastifyPluginAsync } from 'fastify'

import { rpcFetch } from '../../utils/rpc.js'

export const guildChannelsRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', async (req) => {
    const channels = await rpcFetch('lookupGuildChannels', req.context.guild.id)

    return channels
  })
}
