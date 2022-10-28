import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core'
import { Channel }                                   from '@ypbot/database/src/entities/Channel.js'

@Entity({ tableName: 'guilds' })
export class Guild {
  @PrimaryKey()
    id!: string

  @OneToMany(() => Channel, (c) => c.guild)
    channels = new Collection<Channel>(this)
}
