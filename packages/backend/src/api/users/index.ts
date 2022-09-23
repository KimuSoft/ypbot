import { Rule, User } from '@ypbot/database'
import { Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { meilisearch } from '../../utils/meilisearch.js'
import { PaginationResponse } from '../schema/pagination.js'
import { RuleSearchSchema, RuleSearchSchemaType } from '../schema/ruleSearch.js'

declare module 'fastify' {
  interface FastifyContext {
    apiUser: User
  }
}

export const userRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const id = (req.params as { id: string }).id

    if (id) {
      if (id === '@me') {
        if (!req.user) return reply.status(401).send(new Error('Unauthorized'))

        req.context.apiUser = req.user

        return
      }

      const UserRepo = req.em.getRepository(User)

      const user = await UserRepo.findOne({ id })

      if (!user) return reply.status(404).send(new Error('User not found.'))

      req.context.apiUser = user
    }
  })

  server.get<{
    Params: { id: string }
  }>('/:id', async (req) => {
    return req.context.apiUser
  })

  server.get<{
    Params: { id: string }
    Querystring: RuleSearchSchemaType
  }>('/:id/rules', { schema: { querystring: RuleSearchSchema } }, async (req) => {
    const user = req.context.apiUser

    const RulesRepository = req.em.getRepository(Rule)

    const query = req.query

    let filter = `(visibility = ${Visibility.Public})`

    if (req.user) {
      filter += `OR (authors = '${req.user.id}')`
    }

    if (query.visibility !== undefined) {
      filter = `(${filter})AND(visibility=${query.visibility})`
    }

    const { hits, estimatedTotalHits } = await meilisearch.index('rules').search(query.query, {
      offset: query.offset,
      limit: query.limit,
      filter: `authors = '${user.id}' AND (${filter})`,
    })

    const rules = await RulesRepository.find(
      {
        id: { $in: hits.map((x) => x.id) },
      },
      { limit: query.limit, offset: query.offset }
    )

    await req.em.populate(rules, ['authors'])

    return new PaginationResponse(estimatedTotalHits, rules)
  })
}
