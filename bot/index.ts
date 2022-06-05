import 'dotenv/config'
import type { PrismaClient } from '@prisma/client'
import { client } from './bot'
import server, { BUILD_DIR } from './server'
import { Bot } from './structures/bot'

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

const port = process.env.PORT || 3000

const botToken = process.env.BOT_TOKEN

declare global {
  var __db__: PrismaClient
  var cts: Bot
}

setImmediate(async () => {
  console.log('asdf')
  require(BUILD_DIR)

  global.cts = new Bot(client)

  console.log('Logging in discord bot...')
  await client.login(botToken)

  console.log('Starting server...')

  server.listen(port, () => {
    // require the built app so we're ready when the first request comes in
    console.log(`✅ app ready: http://localhost:${port}`)
  })
})
