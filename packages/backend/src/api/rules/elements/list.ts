import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { PaginationResponse, PaginationSchemaType } from '../../schema/pagination.js'

export const ruleElementListRoutes: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: PaginationSchemaType }>('/', async (req) => {
    const rule = req.context.apiRule

    const RuleElementsRepo = req.em.getRepository(RuleElement)

    const query = req.query

    const [elements, count] = await RuleElementsRepo.findAndCount(
      {
        rule: { id: rule.id },
      },
      { limit: query.limit, offset: query.offset }
    )

    return new PaginationResponse(count, elements)
  })
}
