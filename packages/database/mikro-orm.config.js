import 'dotenv/config.js'
import { YPEntities, orm } from '@ypbot/database'
import dotenv              from 'dotenv'
import path                from 'path'
import { fileURLToPath }   from 'url'

await orm.close(true)

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '.env') })

// eslint-disable-next-line arca/no-default-export
export default {
  clientUrl: process.env.PG_DSN,
  type: 'postgresql',
  entities: YPEntities
}
