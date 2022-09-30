import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '..', '.env') })

export const dbUrl = process.env.PG_DSN!

export const dbSecret = process.env.DB_SECRET!.replaceAll("'", "''")
