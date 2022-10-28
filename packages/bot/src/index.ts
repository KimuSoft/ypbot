import 'bot/src/config.js'
import Promise          from 'bluebird'
import { lookupEvents } from 'bot/src/utils/lookup.js'
import { initMetrics }  from 'bot/src/utils/metrics.js'
import { rpc }          from 'bot/src/utils/rpc.js'
import chalk            from 'chalk'
import Eris             from 'eris'

// @ts-expect-error bluebird
global.Promise = Promise

if (process.env.CLUSTER_ID === undefined) throw new Error('CLUSTER_ID is undefined')

const clusterId = +process.env.CLUSTER_ID

if (process.env.BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is undefined')

const client = Eris(process.env.BOT_TOKEN, {
  intents: ['guildMessages', 'guilds', 'messageContent']
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

  rpc.emit('identifyCluster', clusterId)

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
