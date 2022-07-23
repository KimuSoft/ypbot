import { prisma, RuleElement, RuleElementInfo } from "shared"
import { Resolver } from "../../../utils"

export const updateRuleElement: Resolver<
  RuleElement,
  RuleElement,
  { info: Partial<RuleElementInfo> }
> = (elem, { info }) => {
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
