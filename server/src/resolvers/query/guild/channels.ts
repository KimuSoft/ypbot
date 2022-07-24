import { AuthenticationError } from "apollo-server"
import { YPChannel, YPGuild } from "shared"
import { Resolver } from "../../../utils"
import { getGuild } from "../guilds"

export const getGuildChannels: Resolver<YPChannel[], YPGuild> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user) throw new AuthenticationError("Unauthorized")

  const guild = await getGuild(ctx.user, parent.id)

  if (!guild) return []

  return guild.channels.map(
    (x) =>
      ({
        name: x.name,
        id: x.id,
        type: x.type,
      } as YPChannel)
  )
}
