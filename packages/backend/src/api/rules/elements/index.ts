import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch } from '../../../utils/meilisearch.js'
import { createRuleElement } from './create.js'
import { ruleElementListRoutes } from './list.js'
import { updateRuleElementRoutes } from './update.js'

declare module 'fastify' {
  interface FastifyContext {
    apiRuleElement: RuleElement
  }
}

export const ruleElementsRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const { elId } = req.params as { elId: string }
    if (elId) {
      if (!isNaN(Number(elId))) {
        const id = Number(elId)

        const RuleElementsRepo = req.em.getRepository(RuleElement)

        const el = await RuleElementsRepo.findOne({ id, rule: { id: req.context.apiRule.id } })

        req.context.apiRuleElement = el!
      }

      if (!req.context.apiRuleElement)
        return reply.status(404).send(new Error('Rule element not found'))
    }
  })

  server.get('/:elId', async (req) => {
    return req.context.apiRuleElement
  })

  server.delete('/:elId', async (req, reply) => {
    const rule = req.context.apiRule

    const authors = rule.authors

    await authors.init()

    if (!authors.toArray().some((x) => x.id === req.user!.id))
      return reply.status(400).send(new Error('Missing permissions'))

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
