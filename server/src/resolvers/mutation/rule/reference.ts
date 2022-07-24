import { prisma, Rule } from "shared"
import { Resolver } from "../../../utils"

export const addRuleReference: Resolver<
  Rule | null,
  Rule,
  { id: string }
> = async (parent, { id }, { user }) => {
  if (parent.id === id || !user) return null

  const rule = await prisma.rule.findFirst({
    where: {
      id,
      OR: [
        {
          authorId: user.id,
        },
        {
          sharedUser: {
            some: {
              id: user.id,
            },
          },
        },
        {
          isOfficial: true,
        },
      ],
    },
  })

  if (!rule) return rule

  await prisma.rule.update({
    where: {
      id: parent.id,
    },
    data: {
      references: {
        connect: {
          id: rule.id,
        },
      },
    },
  })

  return rule
}

export const removeRuleReference: Resolver<
  boolean | null,
  Rule,
  { id: string }
> = async (parent, { id }, { user }) => {
  if (parent.id === id || !user) return null

  await prisma.rule.update({
    where: { id: parent.id },
    data: {
      references: {
        disconnect: {
          id,
        },
      },
    },
  })

  return true
}
