import { redisUrl } from 'backend/src/config.js'
import Redis        from 'ioredis'

export const redis = new Redis(redisUrl)
