import preval from 'preval.macro'
import react from 'react'

const buildTimestamp = preval`module.exports = Date.now()` as number

export const dependencyVersions = {
    react: react.version,
}

export { buildTimestamp }
