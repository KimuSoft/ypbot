import { createServer, Server } from 'http'
import { config } from './config'
import * as path from 'path'
import { log } from '@blitzjs/display'

let server: Server | null = null

let stopping = false

export const startServer = async () => {
    if (stopping) return

    const spinner = log.spinner('Starting server...')
    spinner.start()
    const app = (await import('./web')).default

    server = createServer(app)

    return new Promise<void>((resolve) => {
        if (!server) return resolve()
        server.listen(config.web.port, () => {
            resolve()
        })
    }).then(() => {
        spinner.stop()
        log.success('Started server!')
    })
}

export const stopServer = async () => {
    if (stopping) return

    stopping = true

    const spinner = log.spinner('Stopping server...')
    spinner.start()

    return new Promise<void>((resolve) => {
        Object.keys(require.cache)
            .filter((x) => x.startsWith(path.join(__dirname, 'web')))
            .forEach((x) => {
                delete require.cache[x]
            })
        if (!server) {
            resolve()
        }
        server?.close(() => {
            resolve()
        })
    }).then(() => {
        spinner.stop()
        log.success('Stopped server!')
        stopping = false
    })
}

export const restartServer = async () => {
    try {
        if (stopping) return
        await stopServer()
        await startServer()
        log.clearConsole()

        log.success('Restarted!')
    } catch (e: any) {
        stopping = false
        log.error(`${e}`)
    }
}
