import { Collection, Entity, Enum, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'

import { Visibility } from '../enums/Visibility.js'
import type { User } from './User.js'

@Entity({ tableName: 'rules' })
export class Rule {
  @PrimaryKey({ type: 'serial' })
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
}
