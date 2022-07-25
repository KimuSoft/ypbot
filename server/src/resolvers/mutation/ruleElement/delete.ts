import { prisma, RuleElement } from "shared"
import { Resolver } from "../../../utils"

export const deleteRuleElement: Resolver<boolean, RuleElement> = async (
  parent
) => {
  await prisma.ruleElement.delete({
    where: {
      id: parent.id,
    },
  })
  return true
}
