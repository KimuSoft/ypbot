import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '..', '.env') })
