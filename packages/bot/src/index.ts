import Promise from 'bluebird'
import chalk from 'chalk'
import Eris from 'eris'

import './config.js'
import { lookupEvents } from './utils/lookup.js'
import { initMetrics } from './utils/metrics.js'
import { rpc } from './utils/rpc.js'

// @ts-expect-error bluebird
global.Promise = Promise

const client = Eris(process.env.BOT_TOKEN!, {
  intents: ['guildMessages', 'guilds', 'messageContent'],
})

client.on('ready', () => {
  console.log(
    chalk.blue(
      `Logged in as ${chalk.green(`${client.user.username}#${client.user.discriminator}`)}`
    )
  )
})

client.on('messageCreate', (msg) => {
  console.log(msg.content)
})

client.on('shardReady', (id) => {
  console.log(chalk.blue(`Shard ${chalk.green(`#${id}`)} ready!`))
})

let waitIdentifyResolve: () => void

const waitIdentify = new Promise<void>((resolve) => {
  waitIdentifyResolve = resolve
})

rpc.on('connect', () => {
  console.log(chalk.gray('Connected to RPC server.'))

  rpc.emit('identifyCluster', +process.env.CLUSTER_ID!)

  waitIdentifyResolve()
})

rpc.on('disconnect', (reason) => {
  console.log(chalk.yellow(`Disconnected from RPC server: ${chalk.gray(reason)}`))
})

initMetrics(client)

lookupEvents(client)

rpc.connect()

await waitIdentify

await client.connect()

console.log(chalk.blue`Connected!`)
