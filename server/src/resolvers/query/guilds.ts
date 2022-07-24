import { AuthenticationError } from "apollo-server"
import { AxiosResponse } from "axios"
import type { Guild } from "bot"
import { Snowflake } from "discord-api-types/globals"
import {
  PermissionFlagsBits,
  RESTAPIPartialCurrentUserGuild,
  RESTGetAPICurrentUserGuildsResult,
} from "discord-api-types/v10"
import _ from "lodash"
import { User, YPGuild } from "shared"
import { TLRU } from "tlru"
import { rpc } from "../../trpc"
import { discordApi, getToken, Resolver } from "../../utils"

export type FullGuild = RESTAPIPartialCurrentUserGuild & Guild & YPGuild

const userGuildsCache = new TLRU<
  Snowflake,
  Promise<AxiosResponse<RESTAPIPartialCurrentUserGuild[]>>
>({
  maxAgeMs: 1000 * 30,
})

const botGuildsCache = new TLRU<Snowflake, Guild>({ maxAgeMs: 1000 * 30 })

const getGuilds = async (user: User) => {
  let userGuildsPromise = userGuildsCache.get(user.id)
  if (!userGuildsPromise) {
    userGuildsPromise = discordApi.get<RESTGetAPICurrentUserGuildsResult>(
      "/users/@me/guilds",
      {
        headers: {
          authorization: `Bearer ${await getToken(user)}`,
        },
      }
    )
    userGuildsCache.set(user.id, userGuildsPromise)
  }

  const userGuilds = (await userGuildsPromise.then((x) => x.data)).filter(
    (x) =>
      (BigInt(x.permissions) & PermissionFlagsBits.Administrator) ===
      PermissionFlagsBits.Administrator
  )

  const botGuilds: Guild[] = []

  const guildsToLoad = new Set<string>()

  for (const guild of userGuilds) {
    const g = botGuildsCache.get(guild.id)
    if (g) {
      botGuilds.push(g)
      continue
    }
    guildsToLoad.add(guild.id)
  }

  if (guildsToLoad.size) {
    const fetchedBotGuilds = await rpc.query("guilds", Array.from(guildsToLoad))

    for (const g of fetchedBotGuilds) {
      botGuilds.push(g)
      botGuildsCache.set(g.id, g)
    }
  }

  return {
    user: userGuilds,
    bot: botGuilds,
    yp: userGuilds.map((x) => {
      const guild = botGuilds.find((y) => x.id === y.id)
      let invited = false
      if (guild) {
        invited = true
      }

      return {
        invited,
        id: x.id,
        name: x.name,
        icon:
          guild?.icon ??
          (x.icon
            ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.webp?size=512`
            : null),
      }
    }) as YPGuild[],
  }
}

export const getGuild = async (
  user: User,
  guildId: Snowflake
): Promise<FullGuild | null> => {
  const guild = await getGuilds(user)

  const g = guild.bot.find((x) => x.id === guildId)
  if (!g) return null

  return _.merge(
    _.merge(guild.user.find((x) => x.id === g.id)!, g),
    guild.yp.find((x) => x.id === g.id)!
  )
}

export const getGuildList: Resolver<YPGuild[]> = async (
  parent,
  params,
  ctx
) => {
  if (!ctx.user) throw new AuthenticationError("Unauthorized")
  const guilds = await getGuilds(ctx.user)
  return guilds.yp
}
