import { MikroORM } from '@mikro-orm/core'

import { dbUrl } from './constants.js'
import { Channel } from './entities/Channel.js'
import { Guild } from './entities/Guild.js'
import { Rule } from './entities/Rule.js'
import { RuleElement } from './entities/RuleElement.js'
import { User } from './entities/User.js'
import { Visibility } from './enums/Visibility.js'

export { UserFlags } from './flags/UserFlags.js'

export const YPEntities = [User, Rule, RuleElement, Guild, Channel]

export const orm = await MikroORM.init({
  entities: YPEntities,
  clientUrl: dbUrl,
  type: 'postgresql',
})

export { User, Visibility, Rule, RuleElement, Guild, Channel }
