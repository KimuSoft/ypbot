import { RuleElement }             from '@ypbot/database'
import { createRuleElement }       from 'backend/src/api/rules/elements/create.js'
import { ruleElementListRoutes }   from 'backend/src/api/rules/elements/list.js'
import { updateRuleElementRoutes } from 'backend/src/api/rules/elements/update.js'
import { meilisearch }             from 'backend/src/utils/meilisearch.js'
import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyContext {
    apiRuleElement: RuleElement
  }
}

export const ruleElementsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const { elId } = req.params as { elId: string }
    if (typeof elId === 'string') {
      if (!isNaN(Number(elId))) {
        const id = Number(elId)

        const RuleElementsRepo = req.em.getRepository(RuleElement)

        const el = await RuleElementsRepo.findOne({ id, rule: { id: req.context.apiRule.id } })

        req.context.apiRuleElement = el as RuleElement
      }

      if (typeof req.context.apiRuleElement !== 'object') { return await reply.status(404).send(new Error('Rule element not found')) }
    }
  })

  server.get('/:elId', async (req) => {
    return req.context.apiRuleElement
  })

  server.delete('/:elId', async (req, reply) => {
    const rule = req.context.apiRule

    const authors = rule.authors

    await authors.init()

    if (!authors.toArray().some((x) => x.id === req.user?.id)) return await reply.status(400).send(new Error('Missing permissions'))

    const el = req.context.apiRuleElement

    const ruleElementsIndex = meilisearch.index('ruleElements')

    await ruleElementsIndex.deleteDocument(el.id)

    await req.em.removeAndFlush(el)

    return { deleted: true }
  })

  await server.register(ruleElementListRoutes)

  await server.register(createRuleElement)

  await server.register(updateRuleElementRoutes)
}
