import { AuthenticationError } from "apollo-server-express"
import { prisma, YPChannel, YPGuild } from "shared"
import { Resolver } from "../../../utils"
import { getGuild } from "../guilds"

export const getAlertChannel: Resolver<YPChannel | null, YPGuild> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user) throw new AuthenticationError("Unauthorized")

  const guild = await getGuild(ctx.user, parent.id)

  if (!guild) return null

  const g = await prisma.guild.findUnique({
    where: { id: parent.id },
    select: { alertChannelId: true },
  })

  if (!g) return null

  const c = guild.channels.find((x) => x.id === g.alertChannelId)

  if (!c) return null

  return {
    name: c.name,
    id: c.id,
    type: c.type,
    parent: c.parent,
    position: c.position,
  } as YPChannel
}
