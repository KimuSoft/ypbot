import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey } from '@mikro-orm/core'
import { Guild }                                                 from '@ypbot/database/src/entities/Guild.js'
import { Rule }                                                  from '@ypbot/database/src/entities/Rule.js'

@Entity({ tableName: 'channels' })
export class Channel {
  @PrimaryKey()
    id!: string

  @ManyToOne('Guild')
    guild!: Guild

  @ManyToMany(() => Rule, (r) => r.channels)
    rules = new Collection<Rule>(this)
}
