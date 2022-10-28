import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import type { Channel } from '@ypbot/database/src/entities/Channel.js'
import { RuleElement }  from '@ypbot/database/src/entities/RuleElement.js'
import type { User }    from '@ypbot/database/src/entities/User.js'
import type { YPRule }  from 'ypbot-api-types'
import { Visibility }   from 'ypbot-api-types'

@Entity({ tableName: 'rules' })
export class Rule {
  @PrimaryKey({ autoincrement: true })
    id!: number

  @Property({ type: 'varchar(36)' })
    name!: string

  @Property({ type: 'varchar(64)' })
    brief!: string

  @Property({ type: 'text' })
    description!: string

  @Enum({ type: () => Visibility, default: Visibility.Private })
    visibility!: Visibility

  @ManyToMany(() => 'User')
    authors = new Collection<User>(this)

  @OneToMany(() => RuleElement, (e) => e.rule, { cascade: [Cascade.REMOVE] })
    elements = new Collection<RuleElement>(this)

  @ManyToMany('Channel')
    channels = new Collection<Channel>(this)

  toJSON (fields: string[] = []): YPRule {
    return {
      id: this.id,
      name: this.name,
      brief: this.brief,
      visibility: this.visibility,
      authors: Array.from(this.authors.toArray().values()).map(x => (x as unknown as User).toJSON()),
      description: fields.includes('description') ? this.description : undefined
    }
  }
}
