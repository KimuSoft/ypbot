import { ValidationError } from "apollo-server-express"
import { prisma, Rule, RuleElement, RuleElementInfo } from "shared"
import { Resolver } from "../../../utils"

export const createRuleElement: Resolver<
  RuleElement,
  Rule,
  { info: RuleElementInfo }
> = async (rule, { info }) => {
  if (info.regex) {
    try {
      new RegExp(info.regex)
    } catch (e) {
      throw new ValidationError("Invalid regex")
    }
  }

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
