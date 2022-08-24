import { ValidationError } from "apollo-server-express"
import { prisma, RuleElement, RuleElementInfo } from "shared"
import { Resolver } from "../../../utils"

export const updateRuleElement: Resolver<
  RuleElement,
  RuleElement,
  { info: Partial<RuleElementInfo> }
> = (elem, { info }) => {
  if (info.regex) {
    try {
      new RegExp(info.regex)
    } catch (e) {
      throw new ValidationError("Invalid regex")
    }
  }

  return prisma.ruleElement.update({
    where: {
      id: elem.id,
    },
    data: {
      name: info.name || undefined,
      regex: info.regex || undefined,
      ruleType: info.ruleType || undefined,
      separate: info.separate ?? undefined,
    },
  })
}
