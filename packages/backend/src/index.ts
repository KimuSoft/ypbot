import 'backend/src/config.js'
import type { EntityManager } from '@mikro-orm/core'
import type { User }          from '@ypbot/database'
import { apiRoutes }          from 'backend/src/api/index.js'
import { rpc }                from 'backend/src/utils/rpc.js'
import chalk                  from 'chalk'
import fastify                from 'fastify'

await new Promise<void>((resolve) => {
  rpc.once('connect', resolve)

  rpc.connect()
})

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
