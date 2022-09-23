import { Rule, Visibility } from '@ypbot/database'
import { FastifyInstance } from 'fastify'

import { meilisearch } from '../../utils/meilisearch.js'
import { PaginationResponse } from '../schema/pagination.js'
import { RuleSearchSchema, RuleSearchSchemaType } from '../schema/ruleSearch.js'

export const ruleList = (server: FastifyInstance) => {
  server.get<{
    Querystring: RuleSearchSchemaType
  }>(
    '/',
    {
      schema: {
        querystring: RuleSearchSchema,
      },
    },
    async (req) => {
      const RulesRepository = req.em.getRepository(Rule)

      const query = req.query

      let filter = `(visibility = ${Visibility.Private})`

      if (req.user) {
        filter += `OR (authors = '${req.user.id}')`
      }

      if (query.visibility !== undefined) {
        filter = `(${filter})AND(visibility=${query.visibility})`
      }

      const { hits, estimatedTotalHits } = await meilisearch.index('rules').search(query.query, {
        offset: query.offset,
        limit: query.limit,
        filter,
      })

      const rules = await RulesRepository.find(
        {
          id: { $in: hits.map((x) => x.id) },
        },
        { limit: query.limit, offset: query.offset }
      )

      await req.em.populate(rules, ['authors'])

      return new PaginationResponse(estimatedTotalHits, rules)
    }
  )
}
