import { Client } from './structures/client'

export const cts = new Client()

import { startServer, stopServer } from './webManager'
import { config } from './config'

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

process.on('exit', (code) => {
    process.stdin.resume()

    cts.client.destroy()

    stopServer()
})

process.on('SIGINT', function () {
    process.exit(2)
})

cts.client.login(config.token).then(() => startServer())

// startServer().then()
