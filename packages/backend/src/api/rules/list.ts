import { Rule, Visibility } from '@ypbot/database'
import { FastifyInstance } from 'fastify'

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

      const [rules, count] = await RulesRepository.findAndCount(
        {
          $or: req.user
            ? [{ visibility: Visibility.Public }, { authors: { id: req.user.id } }]
            : [{ visibility: Visibility.Public }],
          ...(query.visibility !== undefined ? { visibility: query.visibility } : {}),
          ...(query.query ? { name: { $like: `%${query.query}%` } } : {}),
        },
        { limit: query.limit, offset: query.offset }
      )

      await req.em.populate(rules, ['authors'])

      return new PaginationResponse(count, rules)
    }
  )
}
