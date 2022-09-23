import { EntityManager } from '@mikro-orm/core'
import { User } from '@ypbot/database'
import chalk from 'chalk'
import fastify from 'fastify'

import { apiRoutes } from './api/index.js'
import './config.js'

declare module 'fastify' {
  interface FastifyRequest {
    user?: User

    em: EntityManager
  }
}

const server = fastify()

await server.register(apiRoutes, { prefix: '/api' })

const addr = await server.listen({ host: '0.0.0.0', port: 3000 })

console.log(chalk.blue(`Listning on ${chalk.green(addr)}`))
