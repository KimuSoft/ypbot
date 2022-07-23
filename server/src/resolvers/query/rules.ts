import { AuthenticationError } from "apollo-server"
import { prisma, Rule, YPUser } from "shared"
import { Resolver } from "../../utils"

export const getRuleList: Resolver<Rule[]> = async (parent, params, ctx) => {
  if (!ctx.user)
    throw new AuthenticationError("You must be logged in to run this query")

  const rules = await prisma.rule.findMany({
    where: {
      authorId: ctx.user.id,
    },
  })

  return rules
}
