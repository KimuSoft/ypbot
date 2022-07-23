import { prisma, Rule, RuleType } from "shared"
import { Resolver } from "../../../utils"

export const getRuleCounts: Resolver<
  {
    black: number
    white: number
    include: number
  },
  Rule
> = async (rule) => {
  return {
    white: await prisma.ruleElement.count({
      where: {
        ruleId: rule.id,
        ruleType: RuleType.White,
      },
    }),
    black: await prisma.ruleElement.count({
      where: {
        ruleId: rule.id,
        ruleType: RuleType.Black,
      },
    }),
    include: await prisma.ruleElement.count({
      where: {
        ruleId: rule.id,
        ruleType: RuleType.Include,
      },
    }),
  }
}
