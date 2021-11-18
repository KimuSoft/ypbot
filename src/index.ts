import { Client } from './structures/client'

export const cts = new Client()

import { initServer } from './webManager'
import { setGlobal } from './utils/global'
import db from './utils/db'

setGlobal('yp.client', cts.client)
setGlobal('yp.db', db)

// cts.client.login(config.token).then(() => initServer())

initServer().then()
