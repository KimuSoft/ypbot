import { prisma, Rule, YPGuild } from "shared"
import { Resolver } from "../../../utils"

export const getCommonRules: Resolver<Rule[], YPGuild> = async (parent) => {
  return prisma.rule.findMany({
    where: {
      guilds: {
        some: {
          id: parent.id,
        },
      },
    },
  })
}
