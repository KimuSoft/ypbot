import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey } from '@mikro-orm/core'

import type { Guild } from './Guild.js'
import { Rule } from './Rule.js'

@Entity({ tableName: 'channels' })
export class Channel {
  @PrimaryKey()
  id!: string

  @ManyToOne('Guild')
  guild!: Guild

  @ManyToMany(() => Rule, (r) => r.channels)
  rules = new Collection<Rule>(this)
}
