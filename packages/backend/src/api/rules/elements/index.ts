import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

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

  await server.register(ruleElementListRoutes)

  await server.register(createRuleElement)

  await server.register(updateRuleElementRoutes)
}
