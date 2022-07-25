import type { RuleType } from 'shared'

export type CreateRuleElementItemInput = {
  name: string
  ruleType: RuleType
  regex: string
  separate: boolean
}
