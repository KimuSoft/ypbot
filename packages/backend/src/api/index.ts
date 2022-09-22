import { FastifyPluginAsync } from 'fastify'

export const apiRoutes: FastifyPluginAsync = async (server) => {
  server.get('/', () => ({ hello: 'world' }))
}
