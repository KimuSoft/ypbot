import preval from 'preval.macro'
import react from 'react'

const buildTimestamp = preval`module.exports = Date.now()` as number

const version = preval`module.exports = require('../../package.json').version`

export const dependencyVersions: Record<string, string> = preval`module.exports = require('../../package.json').dependencies`

console.log(dependencyVersions)

export { buildTimestamp, version }
