import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

export const deleteRule: Resolver<boolean, Rule> = async (parent) => {
  await prisma.rule.delete({ where: { id: parent.id } })

  return true
}
