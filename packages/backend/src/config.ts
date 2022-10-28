import dotenv            from 'dotenv'
import path              from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '..', '.env') })

if (process.env.JWT_SECRET === undefined) throw new Error('JWT_SECRET is undefined')
if (process.env.REDIS_URL === undefined) throw new Error('REDIS_URL is undefined')

export const jwtSecret = process.env.JWT_SECRET

export const redisUrl = process.env.REDIS_URL
