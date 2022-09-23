import { RuleElement } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch } from '../../../utils/meilisearch.js'
import { PaginationResponse } from '../../schema/pagination.js'
import { RuleElementSearchSchema, RuleElementSearchSchemaType } from '../../schema/ruleSearch.js'

export const ruleElementListRoutes: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: RuleElementSearchSchemaType }>(
    '/',
    { schema: { querystring: RuleElementSearchSchema } },
    async (req) => {
      const rule = req.context.apiRule

      const RuleElementsRepo = req.em.getRepository(RuleElement)

      const query = req.query

      const hitElements = await meilisearch.index('ruleElements').search(query.query, {
        filter: [`rule = ${rule.id}`],
        offset: query.offset,
        limit: query.limit,
      })

      const elements = await RuleElementsRepo.find(
        {
          id: {
            $in: hitElements.hits.map((x) => x.id),
          },
        },
        { limit: query.limit, offset: query.offset }
      )

      return new PaginationResponse(hitElements.estimatedTotalHits, elements)
    }
  )
}
