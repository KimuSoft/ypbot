import { Collection } from '@mikro-orm/core'
import { User } from '@ypbot/database'
import { Visibility } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

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
  }>('/:id/rules', async (req) => {
    const user = req.context.apiUser

    await user.rules.init()

    await req.em.populate(user, ['rules.authors'])

    return user.rules.toArray().filter((x) => {
      const authors = (x.authors as unknown as Collection<User, object>).toArray()
      return x.visibility === Visibility.Public || authors.some((y) => y.id === req.user!.id)
    })
  })
}
