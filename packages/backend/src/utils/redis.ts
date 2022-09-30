import Redis from 'ioredis'

import { redisUrl } from '../config.js'

export const redis = new Redis(redisUrl)
