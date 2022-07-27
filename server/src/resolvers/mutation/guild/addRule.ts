import { Channel } from "bot"
import { prisma, Rule, YPChannel, YPGuild } from "shared"
import { Resolver } from "../../../utils"

export const addRuleToGuild: Resolver<
  Rule | null,
  YPGuild,
  { id: string }
> = async (parent, { id }, { user }) => {
  if (!user) return null
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

  if (!rule) return null

  await prisma.guild.upsert({
    create: {
      id: parent.id,
      commonRules: {
        connect: {
          id: rule.id,
        },
      },
    },
    update: {
      commonRules: {
        connect: {
          id: rule.id,
        },
      },
    },
    where: {
      id: parent.id,
    },
  })

  return rule
}
