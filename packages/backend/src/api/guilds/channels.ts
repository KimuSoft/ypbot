import { Static, Type } from '@sinclair/typebox'
import { Channel, Guild, Rule, Visibility } from '@ypbot/database'
import { FastifyContext, FastifyPluginAsync } from 'fastify'

import { requireAuth } from '../../utils/auth.js'
import { rpcFetch } from '../../utils/rpc.js'
import { PaginationResponse } from '../schema/pagination.js'
import { ChanenlRuleSearchSchema } from '../schema/ruleSearch.js'

declare module 'fastify' {
  interface FastifyContext {
    botChannel: {
      id: string
      name: string
      type: number
    }
    channel: Channel
  }
}

const ChannelRuleAddSchema = Type.Object({
  rule: Type.Integer(),
})

export const guildChannelsRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', async (req) => {
    const channels = await rpcFetch('lookupGuildChannels', req.context.guild.id)

    return channels
  })

  server.addHook('onRequest', async (req, reply) => {
    const { channelId } = req.params as { channelId: string }

    const botChannel = await rpcFetch('lookupGuildChannel', req.context.guild.id, channelId)

    if (!botChannel) return reply.status(404).send(new Error('Channel not found'))

    let channel = await req.em.getRepository(Channel).findOne({
      id: channelId,
      guild: {
        id: req.context.guild.id,
      },
    })

    if (!channel) {
      let guild = await req.em.getRepository(Guild).findOne({
        id: req.context.guild.id,
      })

      if (!guild) {
        guild = new Guild()
        guild.id = req.context.guild.id
      }

      req.em.persist(guild)

      channel = new Channel()

      channel.id = channelId

      channel.guild = guild

      req.em.persist(channel)

      await req.em.flush()
    }

    req.context.botChannel = botChannel as FastifyContext['botChannel']

    req.context.channel = channel
  })

  server.get('/:channelId', (req) => {
    return req.context.botChannel
  })

  server.get<{ Querystring: Static<typeof ChanenlRuleSearchSchema> }>(
    '/:channelId/rules',
    {
      schema: {
        querystring: ChanenlRuleSearchSchema,
      },
    },
    async (req) => {
      const ch = req.context.channel

      const RulesRepository = req.em.getRepository(Rule)

      const [rules, count] = await RulesRepository.findAndCount(
        {
          channels: {
            id: ch.id,
          },
        },
        { limit: req.query.limit, offset: req.query.offset }
      )

      return new PaginationResponse(count, rules)
    }
  )

  server.post<{ Body: Static<typeof ChannelRuleAddSchema> }>(
    '/:channelId/rules',
    {
      schema: {
        body: ChannelRuleAddSchema,
      },
    },
    requireAuth(async (req, reply) => {
      const RuleRepo = req.em.getRepository(Rule)

      const rule = await RuleRepo.findOne({
        id: req.body.rule,
        $or: [
          {
            authors: {
              id: req.user!.id,
            },
          },
          {
            visibility: Visibility.Public,
          },
        ],
      })

      if (!rule) return reply.status(400).send(new Error('Rule not found'))

      const channel = req.context.channel

      await channel.rules.init()

      if (channel.rules.contains(rule)) {
        return reply.status(400).send(new Error('Rule is already added'))
      }

      channel.rules.add(rule)

      await req.em.populate(rule, ['authors'])

      await req.em.persistAndFlush(channel)

      return reply.send(rule)
    })
  )
}
