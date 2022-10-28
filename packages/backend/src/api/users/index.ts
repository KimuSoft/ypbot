import { Rule, User }                from '@ypbot/database'
import { PaginationResponse }        from 'backend/src/api/schema/pagination.js'
import type { RuleSearchSchemaType } from 'backend/src/api/schema/ruleSearch.js'
import { RuleSearchSchema }          from 'backend/src/api/schema/ruleSearch.js'
import { meilisearch }               from 'backend/src/utils/meilisearch.js'
import type { FastifyPluginAsync }   from 'fastify'
import { Visibility }                from 'ypbot-api-types'

declare module 'fastify' {
  interface FastifyContext {
    apiUser: User
  }
}

export const userRoutes: FastifyPluginAsync = async (server) => {
  server.addHook('onRequest', async (req, reply) => {
    const id = (req.params as { id: string }).id

    if (typeof id === 'string') {
      if (id === '@me') {
        if (req.user == null) return await reply.status(401).send(new Error('Unauthorized'))

        req.context.apiUser = req.user

        return
      }

      const UserRepo = req.em.getRepository(User)

      const user = await UserRepo.findOne({ id })

      if (user == null) return await reply.status(404).send(new Error('User not found.'))

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

    if (req.user != null) filter += `OR (authors = '${req.user.id}')`

    if (query.visibility !== undefined) filter = `(${filter})AND(visibility=${query.visibility})`

    const { hits, estimatedTotalHits } = await meilisearch.index('rules').search(query.query, {
      offset: query.offset,
      limit: query.limit,
      filter: `authors = '${user.id}' AND (${filter})`
    })

    const rules = await RulesRepository.find(
      {
        id: { $in: hits.map((x) => x.id) }
      },
      { limit: query.limit, offset: query.offset }
    )

    await req.em.populate(rules, ['authors'])

    return new PaginationResponse(estimatedTotalHits, rules)
  })
}
