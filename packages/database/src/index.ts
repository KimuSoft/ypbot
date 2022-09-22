import { MikroORM } from '@mikro-orm/core'

import { dbUrl } from './constants.js'
import { User } from './entities/User.js'

export { UserFlags } from './flags/UserFlags.js'

export const orm = await MikroORM.init({
  entities: [User],
  clientUrl: dbUrl,
  type: 'postgresql',
})

export { User }
