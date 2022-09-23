import { MikroORM } from '@mikro-orm/core'

import { dbUrl } from './constants.js'
import { Rule } from './entities/Rule.js'
import { RuleElement } from './entities/RuleElement.js'
import { User } from './entities/User.js'
import { Visibility } from './enums/Visibility.js'

export { UserFlags } from './flags/UserFlags.js'

export const orm = await MikroORM.init({
  entities: [User, Rule, RuleElement],
  clientUrl: dbUrl,
  type: 'postgresql',
})

export const YPEntities = [User, Rule, RuleElement]

export { User, Visibility, Rule, RuleElement }
