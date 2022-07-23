import { AuthenticationError } from "apollo-server"
import { prisma, Rule } from "shared"
import { Resolver } from "../../utils"

export const addShared: Resolver<
  Rule | null,
  unknown,
  { code: string }
> = async (parent, params, ctx) => {
  if (!ctx.user)
    throw new AuthenticationError(
      "You must be logged in to perform this action"
    )

  const shareCode = await prisma.rule.findFirst({ where: {} })

  return null
}

export const removeShared: Resolver<boolean, unknown, { id: string }> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user)
    throw new AuthenticationError(
      "You must be logged in to perform this action"
    )

  await prisma.user.update({
    where: {
      id: ctx.user.id,
    },
    data: {
      rules: {
        disconnect: {
          id: params.id,
        },
      },
    },
  })

  return true
}
