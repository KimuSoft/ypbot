import { FilterQuery } from '@mikro-orm/core'
import { Rule, Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { createRule } from './create.js'

declare module 'fastify' {
  interface FastifyContext {
    apiRule: Rule
  }
}

export const rulesRoutes: FastifyPluginAsync = async (server) => {
  createRule(server)

  server.addHook('onRequest', async (req, reply) => {
    const { id } = req.params as { id: string }
    if (id) {
      if (!isNaN(Number(id))) {
        const RuleRepo = req.em.getRepository(Rule)

        const or: FilterQuery<Rule>[] = [{ visibility: Visibility.Public }]

        if (req.user) {
          or.push({
            authors: {
              id: req.user.id,
            },
          })
        }

        const rule = await RuleRepo.findOne({
          id: Number(id),
          $or: or,
        })

        req.context.apiRule = rule!
      }

      if (!req.context.apiRule) {
        return reply.status(404).send(new Error('Rule not found.'))
      }
    }
  })

  server.get('/:id', async (req) => {
    await req.em.populate(req.context.apiRule, ['authors'])

    return req.context.apiRule
  })
}
