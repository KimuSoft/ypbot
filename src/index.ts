import { Client } from './structures/client'

export const cts = new Client()

import { initServer } from './webManager'
import { setGlobal } from './utils/global'
import db from './utils/db'
import { config } from './config'

setGlobal('yp.client', cts.client)
setGlobal('yp.db', db)

process.env.DISCORD_CLIENT_ID = config.discord.client.id
process.env.DISCORD_CLIENT_SECRET = config.discord.client.secret
process.env.DISCORD_CLIENT_CALLBACK = config.discord.client.callback

// cts.client.login(config.token).then(() => initServer())

initServer().then()
