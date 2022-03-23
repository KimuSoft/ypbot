import { Server } from 'http'
import { config } from './config'
import { log } from '@blitzjs/display'
import * as http from 'http'
import express, { Express } from 'express'
import path from 'path'
import next from 'next'

const tempExpressServer = express()

let server: Server = http.createServer(async (req, res) => {
    ;(app ?? tempExpressServer)(req, res)
})

const nextApp = next({ dev: config.dev })

const nextHandler = nextApp.getRequestHandler()

let app: Express | null = null

export const loadServer = async (removeCache: boolean) => {
    if (removeCache) {
        Object.keys(require.cache)
            .filter((x) => x.startsWith(path.join(__dirname, 'web/')))
            .forEach((x) => delete require.cache[x])
    }
    const exports = await import('./web')
    exports.setNext(nextHandler)
    app = exports.default
    log.success('Loaded server!')
}

export const startServer = async () => {
    await nextApp.prepare()
    await loadServer(false)
    const spinner = log.spinner('Starting server...')
    spinner.start()

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
