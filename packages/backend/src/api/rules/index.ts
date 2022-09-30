import { FilterQuery } from '@mikro-orm/core'
import { Rule, Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch } from '../../utils/meilisearch.js'
import { createRule } from './create.js'
import { ruleElementsRoutes } from './elements/index.js'
import { ruleList } from './list.js'
import { ruleUpdateRoutes } from './update.js'

declare module 'fastify' {
  interface FastifyContext {
    apiRule: Rule
  }
}

export const rulesRoutes: FastifyPluginAsync = async (server) => {
  createRule(server)
  ruleList(server)

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

    return req.context.apiRule.toJSON(['description'])
  })

  server.delete('/:id', async (req, reply) => {
    const rule = req.context.apiRule

    const authors = rule.authors

    await authors.init()

    if (!authors.toArray().some((x) => x.id === req.user!.id))
      return reply.status(400).send(new Error('Missing permissions'))

    await rule.elements.init()

    const elements = rule.elements.toArray().map((x) => x.id)

    const rulesIndex = meilisearch.index('rules')
    const ruleElementsIndex = meilisearch.index('ruleElements')

    await ruleElementsIndex.deleteDocuments(elements)

    await rulesIndex.deleteDocument(rule.id)

    await req.em.removeAndFlush(rule)

    return { deleted: true }
  })

  await server.register(ruleElementsRoutes, { prefix: '/:id/elements' })

  await server.register(ruleUpdateRoutes)
}
