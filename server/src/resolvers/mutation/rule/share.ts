import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

export const setRuleSharable: Resolver<boolean, Rule, boolean> = async (
  parent,
  value
) => {
  await prisma.rule.update({
    where: { id: parent.id },
    data: {
      sharingEnabled: value,
    },
  })

  return true
}
