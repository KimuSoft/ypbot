import { Channel } from "bot"
import { prisma, YPChannel } from "shared"
import { Resolver } from "../../../utils"

export const removeRuleFromChannel: Resolver<
  boolean,
  YPChannel & Channel,
  { id: string }
> = async (parent, { id }) => {
  await prisma.channel.update({
    where: {
      id: parent.id,
    },
    data: {
      rules: {
        disconnect: {
          id,
        },
      },
    },
  })

  return true
}
