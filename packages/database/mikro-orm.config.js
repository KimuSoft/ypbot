import 'dotenv/config.js'
import { YPEntities, orm } from '@ypbot/database'
import dotenv              from 'dotenv'
import path                from 'path'
import { fileURLToPath }   from 'url'

await orm.close(true)

const dirname = fileURLToPath(import.meta.url)

dotenv.config({ path: path.join(dirname, '..', '..', '..', '.env') })

process.env.MIKRO_ORM_DYNAMIC_IMPORTS = '1'
process.env.MIKRO_ORM_ENTITIES = 'dist/entities/*.js'
process.env.MIKRO_ORM_ENTITIES_TS = 'src/entities/*.ts'
process.env.MIKRO_ORM_MIGRATIONS_PATH = 'dist/migrations'
process.env.MIKRO_ORM_MIGRATIONS_PATH_TS = 'src/migrations'
process.env.MIKRO_ORM_TYPE = 'postgresql'

/**
 * @type {import('@mikro-orm/core').Configuration}
 */
// eslint-disable-next-line arca/no-default-export
export default {
  clientUrl: process.env.PG_DSN,
  type: 'postgresql',
  entities: YPEntities
}
