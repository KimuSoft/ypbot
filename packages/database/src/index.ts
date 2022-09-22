import { MikroORM } from '@mikro-orm/core'

import { dbUrl } from './constants.js'
import { Rule } from './entities/Rule.js'
import { User } from './entities/User.js'
import { Visibility } from './enums/Visibility.js'

export { UserFlags } from './flags/UserFlags.js'

export const orm = await MikroORM.init({
  entities: [User, Rule],
  clientUrl: dbUrl,
  type: 'postgresql',
})

export const YPEntities = [User, Rule]

export { User, Visibility, Rule }
