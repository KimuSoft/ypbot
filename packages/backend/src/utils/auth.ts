import { RouteGenericInterface, RouteHandler } from 'fastify'

export const requireAuth = <T extends RouteGenericInterface>(handler: RouteHandler<T>) => {
  return (async (req, reply) => {
    if (!req.user) return reply.status(401).send(new Error('Unauthorized') as never)

    return handler.bind(req.server)(req, reply)
  }) as RouteHandler<T>
}
