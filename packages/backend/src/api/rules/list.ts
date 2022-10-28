import { Rule }                      from '@ypbot/database'
import { PaginationResponse }        from 'backend/src/api/schema/pagination.js'
import type { RuleSearchSchemaType } from 'backend/src/api/schema/ruleSearch.js'
import { RuleSearchSchema }          from 'backend/src/api/schema/ruleSearch.js'
import { meilisearch }               from 'backend/src/utils/meilisearch.js'
import type { FastifyInstance }      from 'fastify'
import { Visibility }                from 'ypbot-api-types'

export const ruleList = (server: FastifyInstance): void => {
  server.get<{
    Querystring: RuleSearchSchemaType
  }>(
    '/',
    {
      schema: {
        querystring: RuleSearchSchema
      }
    },
    async (req) => {
      const RulesRepository = req.em.getRepository(Rule)

      const query = req.query

      let filter = `(visibility = ${Visibility.Private})`

      if (req.user != null) filter += `OR (authors = '${req.user.id}')`

      if (query.visibility !== undefined) filter = `(${filter})AND(visibility=${query.visibility})`

      const { hits, estimatedTotalHits } = await meilisearch.index('rules').search(query.query, {
        offset: query.offset,
        limit: query.limit,
        filter
      })

      const rules = await RulesRepository.find(
        {
          id: { $in: hits.map((x) => x.id) }
        },
        { limit: query.limit, offset: query.offset }
      )

      await req.em.populate(rules, ['authors'])

      return new PaginationResponse(estimatedTotalHits, rules)
    }
  )
}
