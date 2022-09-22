import chalk from 'chalk'
import fastify from 'fastify'

const server = fastify()

const addr = await server.listen({ host: '0.0.0.0', port: 3000 })

console.log(chalk.blue(`Listning on ${chalk.green(addr)}`))
