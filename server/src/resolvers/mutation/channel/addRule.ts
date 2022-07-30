import { Channel } from "bot"
import { prisma, Rule, YPChannel } from "shared"
import { Resolver } from "../../../utils"

export const addRuleToChannel: Resolver<
  Rule | null,
  YPChannel & Omit<Channel, "type">,
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

  await prisma.channel.upsert({
    create: {
      id: parent.id,
      guildId: parent.guild,
      rules: {
        connect: {
          id: rule.id,
        },
      },
    },
    update: {
      rules: {
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
