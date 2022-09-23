import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'

import type { Rule } from './Rule.js'

@Entity({ tableName: 'ruleElements' })
export class RuleElement {
  @PrimaryKey({ autoincrement: true })
  id!: number

  @Property()
  name!: string

  @Property()
  advanced!: boolean

  @Property()
  keyword!: string

  @ManyToOne('Rule')
  rule!: Rule
}
