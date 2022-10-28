import { RuleElement }                      from '@ypbot/database'
import { PaginationResponse }               from 'backend/src/api/schema/pagination.js'
import type { RuleElementSearchSchemaType } from 'backend/src/api/schema/ruleSearch.js'
import { RuleElementSearchSchema }          from 'backend/src/api/schema/ruleSearch.js'
import { meilisearch }                      from 'backend/src/utils/meilisearch.js'
import type { FastifyPluginAsync }          from 'fastify'

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
        limit: query.limit
      })

      const elements = await RuleElementsRepo.find(
        {
          id: {
            $in: hitElements.hits.map((x) => x.id)
          }
        },
        { limit: query.limit, offset: query.offset }
      )

      return new PaginationResponse(hitElements.estimatedTotalHits, elements)
    }
  )
}
