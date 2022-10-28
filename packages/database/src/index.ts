import { MikroORM }    from '@mikro-orm/core'
import { dbUrl }       from '@ypbot/database/src/constants.js'
import { Channel }     from '@ypbot/database/src/entities/Channel.js'
import { Guild }       from '@ypbot/database/src/entities/Guild.js'
import { Rule }        from '@ypbot/database/src/entities/Rule.js'
import { RuleElement } from '@ypbot/database/src/entities/RuleElement.js'
import { User }        from '@ypbot/database/src/entities/User.js'

export const YPEntities = [User, Rule, RuleElement, Guild, Channel]

export const orm = await MikroORM.init({
  entities: YPEntities,
  clientUrl: dbUrl,
  type: 'postgresql'
})

export { User, Rule, RuleElement, Guild, Channel }
