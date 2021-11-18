import { Client } from './structures/client'
import { config } from './config'

export const cts = new Client()

import { initServer } from './webManager'
import { setGlobal } from './utils/global'

setGlobal('yp.client', cts.client)

// cts.client.login(config.token).then(() => initServer())

initServer().then()
