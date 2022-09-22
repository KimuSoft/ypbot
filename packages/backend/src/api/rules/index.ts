import { FastifyPluginAsync } from 'fastify'

import { createRule } from './create.js'

export const rulesRoutes: FastifyPluginAsync = async (server) => {
  createRule(server)
}
