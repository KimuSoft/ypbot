import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Rule }                                     from '@ypbot/database/src/entities/Rule.js'
import type { YPRuleElement }                            from 'ypbot-api-types'
import { RuleElementType }                               from 'ypbot-api-types'

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

  @Enum({ type: () => RuleElementType })
    type!: RuleElementType

  toJSON (): YPRuleElement {
    return {
      id: this.id,

      name: this.name,
      advanced: this.advanced,
      keyword: this.keyword,

      type: this.type
    }
  }
}
