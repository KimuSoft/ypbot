import { Channel } from "bot"
import { prisma, YPChannel, YPGuild } from "shared"
import { Resolver } from "../../../utils"
import { getAlertChannel } from "../../query/guild/alertChannel"
import { getGuildChannels } from "../../query/guild/channels"
import { FullGuild } from "../../query/guilds"

export const getChannelMutation: Resolver<
  (YPChannel & Channel) | null,
  FullGuild,
  { id: string }
> = (parent, { id }) => {
  return (
    (parent.channels as unknown[] as (YPChannel & Channel)[]).find(
      (x) => x.id === id
    ) || null
  )
}

export const setAlertChannel: Resolver<
  boolean,
  FullGuild,
  { id: string }
> = async (parent, { id }, ctx, info) => {
  const channels = await getGuildChannels(
    parent as YPGuild,
    {} as unknown,
    ctx,
    info
  )

  const channel = channels.find((x) => x.id === id)

  if (!channel) throw new Error("channel not found")

  await prisma.guild.upsert({
    where: { id: parent.id },
    create: {
      id: parent.id,
      alertChannelId: channel.id,
    },
    update: {
      alertChannelId: channel.id,
    },
  })

  return true
}

export const resetAlertChannel: Resolver<boolean, FullGuild> = async (
  parent,
  params,
  ctx,
  info
) => {
  await prisma.guild.updateMany({
    where: { id: parent.id },
    data: { alertChannelId: null },
  })

  return true
}
