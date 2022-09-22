import { User } from '@ypbot/database'
import { FastifyPluginAsync } from 'fastify'

export const userRoutes: FastifyPluginAsync = async (server) => {
  server.get<{
    Params: { id: string }
  }>('/:id', async (req, reply) => {
    const id = req.params.id

    if (id === '@me') {
      if (!req.user) return reply.status(401).send(new Error('Unauthorized'))

      return reply.status(200).send(req.user)
    }

    const UserRepo = req.em.getRepository(User)

    const user = await UserRepo.findOne({ id })

    if (!user) return reply.status(404).send(new Error('User not found.'))

    return user
  })
}
