import { prisma, Rule, YPChannel } from "shared"
import { Resolver } from "../../../utils"

export const getChannelRules: Resolver<Rule[], YPChannel> = (parent) => {
  return prisma.rule.findMany({
    where: {
      channels: {
        some: {
          id: parent.id,
        },
      },
    },
  })
}
