import { AuthenticationError } from "apollo-server"
import { prisma, Rule } from "shared"
import { Resolver } from "../../utils"

export const createRule: Resolver<
  Rule,
  unknown,
  { name: string; description: string }
> = async (parent, params, ctx) => {
  if (!ctx.user)
    throw new AuthenticationError("You must be authenticated to use this")

  const rule = await prisma.rule.create({
    data: {
      name: params.name,
      description: params.description,
      author: {
        connect: {
          id: ctx.user.id,
        },
      },
    },
  })

  return rule
}
