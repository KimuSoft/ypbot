import {
  Cascade,
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core'

import { Visibility } from '../enums/Visibility.js'
import { RuleElement } from './RuleElement.js'
import type { User } from './User.js'

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

  toJSON(fields: string[] = []) {
    return {
      id: this.id,
      name: this.name,
      brief: this.brief,
      visibility: this.visibility,
      authors: this.authors,
      description: fields.includes('description') ? this.description : undefined,
    }
  }
}
