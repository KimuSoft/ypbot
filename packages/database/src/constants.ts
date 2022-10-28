import dotenv            from 'dotenv'
import path              from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '..', '.env') })

if (process.env.PG_DSN === undefined) throw new Error('PG_DSN is undefined')
if (process.env.DB_SECRET === undefined) throw new Error('DB_SECRET is undefined')

export const dbUrl = process.env.PG_DSN

export const dbSecret = process.env.DB_SECRET.replaceAll("'", "''")
