import { Channel } from "bot"
import { prisma, YPChannel, YPGuild } from "shared"
import { Resolver } from "../../../utils"

export const removeRuleFromGuild: Resolver<
  boolean,
  YPGuild,
  { id: string }
> = async (parent, { id }) => {
  await prisma.guild.update({
    where: {
      id: parent.id,
    },
    data: {
      commonRules: {
        disconnect: {
          id,
        },
      },
    },
  })

  return true
}
