import preval from 'preval.macro'

const buildTimestamp = preval`module.exports = Date.now()` as number

const version = preval`module.exports = require('../../package.json').version`

export const dependencyVersions: Record<
    string,
    string
> = preval`module.exports = Object.fromEntries(Object.entries(JSON.parse(require('child_process').execSync('npm ls --json').toString()).dependencies).map(([x,y])=>[x,y.version]))`

export { buildTimestamp, version }
