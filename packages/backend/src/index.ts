import chalk from 'chalk'
import fastify from 'fastify'

import { apiRoutes } from './api/index.js'
import './config.js'

const server = fastify()

server.register(apiRoutes, { prefix: '/api' })

const addr = await server.listen({ host: '0.0.0.0', port: 3000 })

console.log(chalk.blue(`Listning on ${chalk.green(addr)}`))
