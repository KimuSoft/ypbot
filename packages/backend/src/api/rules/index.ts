import type { FilterQuery }        from '@mikro-orm/core'
import { Rule }                    from '@ypbot/database'
import { createRule }              from 'backend/src/api/rules/create.js'
import { ruleElementsRoutes }      from 'backend/src/api/rules/elements/index.js'
import { ruleList }                from 'backend/src/api/rules/list.js'
import { ruleUpdateRoutes }        from 'backend/src/api/rules/update.js'
import { meilisearch }             from 'backend/src/utils/meilisearch.js'
import type { FastifyPluginAsync } from 'fastify'
import { Visibility }              from 'ypbot-api-types'

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
    if (typeof id === 'string') {
      if (!isNaN(Number(id))) {
        const RuleRepo = req.em.getRepository(Rule)

        const or: Array<FilterQuery<Rule>> = [{ visibility: Visibility.Public }]

        if (req.user != null) {
          or.push({
            authors: {
              id: req.user.id
            }
          })
        }

        const rule = await RuleRepo.findOne({
          id: Number(id),
          $or: or
        })

        req.context.apiRule = (rule ?? null) as Rule
      }

      if (req.context.apiRule === null) {
        return await reply.status(404).send(new Error('Rule not found.'))
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

    if (!authors.toArray().some((x) => x.id === req.user?.id)) return await reply.status(400).send(new Error('Missing permissions'))

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
