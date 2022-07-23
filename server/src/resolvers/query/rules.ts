import { AuthenticationError } from "apollo-server"
import { prisma, Rule } from "shared"
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

export const findRule: Resolver<Rule | null, unknown, { id: string }> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user)
    throw new AuthenticationError("You must be logged in to run this query")

  const rules = await prisma.rule.findFirst({
    where: {
      authorId: ctx.user.id,
      id: params.id,
    },
  })

  return rules
}

export const getSharedRules: Resolver<Omit<Rule, "shareCode">[]> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user)
    throw new AuthenticationError(
      "Authentication is required to perform this action"
    )

  return (
    (
      await prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: {
          sharedRules: {
            select: {
              shareCode: false,
              authorId: true,
              description: true,
              id: true,
              isOfficial: true,
              name: true,
              sharingEnabled: true,
            },
          },
        },
      })
    )?.sharedRules ?? []
  )
}

export const getOfficialRules: Resolver<
  Omit<Rule, "shareCode">[]
> = async () => {
  return prisma.rule.findMany({
    select: {
      shareCode: false,
      authorId: true,
      description: true,
      id: true,
      isOfficial: true,
      name: true,
      sharingEnabled: true,
    },
    where: {
      isOfficial: true,
    },
  })
}
