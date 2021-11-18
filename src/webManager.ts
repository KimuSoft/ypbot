import blitz from 'blitz/custom-server'
import { config } from './config'
import { createServer } from 'http'
import { parse } from 'url'
import * as path from 'path'
import { log } from '@blitzjs/display'

export const initServer = async () => {
    const app = blitz({ dev: config.dev, dir: path.join(__dirname, '../web') })
    const handler = app.getRequestHandler()

    await app.prepare()

    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)

        return handler(req, res, parsedUrl)
    })

    server.listen(config.web.port)

    log.success('Server started')
}
