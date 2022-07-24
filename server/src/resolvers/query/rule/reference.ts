import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

export const getRuleReferences: Resolver<Rule[], Rule> = (parent) => {
  return prisma.rule.findMany({
    where: {
      referencedBy: {
        some: {
          id: parent.id,
        },
      },
    },
  })
}
