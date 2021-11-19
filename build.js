const { build } = require('@blitzjs/server')
const path = require('node:path')
const { log } = require('@blitzjs/display')

log.progress('Building web project...')

build({
    rootFolder: path.join(__dirname, 'web'),
    buildFolder: path.join(__dirname, 'web'),
    env: 'prod',
})
    .catch((e) => {
        log.error(e)
    })
    .then(() => {
        log.success('Build complete')
    })
