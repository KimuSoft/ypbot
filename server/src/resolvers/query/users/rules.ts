import { AuthenticationError } from "apollo-server"
import { prisma, YPUser } from "shared"
import { Resolver } from "../../../utils"

export const getUserRules: Resolver<any, YPUser> = async (
  user,
  params,
  ctx
) => {
  if (user.id !== ctx.user?.id)
    throw new AuthenticationError("You cannot load other user's rules")

  const rules = await prisma.rule.findMany({
    where: {
      authorId: user.id,
    },
  })

  return rules
}
