import { prisma, Rule, RuleElement, RuleElementInfo } from "shared"
import { Resolver } from "../../../utils"

export const createRuleElement: Resolver<
  RuleElement,
  Rule,
  { info: RuleElementInfo }
> = async (rule, { info }) => {
  return prisma.ruleElement.create({
    data: {
      name: info.name,
      regex: info.regex,
      ruleType: info.ruleType,
      separate: info.separate,
      rule: {
        connect: {
          id: rule.id,
        },
      },
    },
  })
}
