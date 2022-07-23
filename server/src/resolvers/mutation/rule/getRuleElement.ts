import { prisma, Rule, RuleElement } from "shared"
import { Resolver } from "../../../utils"

export const getRuleElementMutation: Resolver<
  RuleElement | null,
  Rule,
  { id: string }
> = (parent, params) => {
  return prisma.ruleElement.findFirst({
    where: {
      id: params.id,
      ruleId: parent.id,
    },
  })
}
