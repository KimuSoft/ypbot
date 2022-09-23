import { Collection } from '@mikro-orm/core'
import { Rule, User } from '@ypbot/database'
import { Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

import { PaginationResponse, PaginationSchema, PaginationType } from '../schema/Pagination.js'

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
    QueryString: PaginationType
  }>('/:id/rules', { schema: { querystring: PaginationSchema } }, async (req) => {
    const user = req.context.apiUser

    const RulesRepository = req.em.getRepository(Rule)

    const query = req.query as PaginationType

    const [rules, count] = await RulesRepository.findAndCount(
      {
        authors: { id: user.id },
        $or: req.user
          ? [{ visibility: Visibility.Public }, { authors: { id: req.user.id } }]
          : [{ visibility: Visibility.Public }],
      },
      { limit: query.limit, offset: query.offset }
    )

    await req.em.populate(rules, ['authors'])

    return new PaginationResponse(count, rules)
  })
}
