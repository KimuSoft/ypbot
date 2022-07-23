import { prisma, Rule, RuleElement } from "shared"
import { Resolver } from "../../../utils"

export const getRuleElements: Resolver<RuleElement[], Rule> = async (
  parent,
  params,
  ctx
) => {
  return prisma.ruleElement.findMany({
    where: {
      ruleId: parent.id,
    },
  })
}
