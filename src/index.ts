import { Client } from './structures/client'

export const cts = new Client()

import { startServer } from './webManager'
import { config } from './config'

cts.client.login(config.token).then(() => startServer())

// startServer().then()
