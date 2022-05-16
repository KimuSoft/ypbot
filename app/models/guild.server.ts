import _ from 'lodash'
import { TLRU } from 'tlru'
import { prisma } from '~/db.server'
import { discordApi, getToken } from '~/discordApi.server'
import { getUser } from '~/session.server'
import type { User } from './user.server'

export type YPChannel = {
  id: string
  name: string
  rules: { name: string; id: string }[]
}

export type YPCategory = {
  name: string | null
  channels: YPChannel[]
}

export type YPGuild = {
  id: string
  name: string
  owner: boolean
  joined: boolean
  icon: string | null
  channels: YPCategory[]
}

export const guildsCache = new TLRU<User['id'], YPGuild[]>({ maxAgeMs: 10000 })

const discordGuildsCache = new TLRU<User['id'], any[]>({ maxAgeMs: 10000 })

export const getGuildList = async (
  req: Request
): Promise<YPGuild[] | undefined> => {
  const user = await getUser(req)

  if (!user) return

  const existing = guildsCache.get(user.id)
  if (existing) return existing

  let guilds: any[] | undefined = discordGuildsCache.get(user.id)

  if (!guilds) {
    const { data } = await discordApi.get<any[]>('/users/@me/guilds', {
      headers: { Authorization: await getToken(user) },
    })

    guilds = data

    discordGuildsCache.set(user.id, guilds)
  }

  const withPerms = guilds.filter((x) => (Number(x.permissions) & 8) === 8)

  return Promise.all(
    withPerms.map(async (x) => {
      const guild = cts.client.guilds.cache.get(x.id)

      let categories: YPCategory[] = []

      if (guild) {
        for (const category of [
          null,
          ..._.sortBy(
            guild.channels.cache
              .filter((x) => x.type === 'GUILD_CATEGORY')
              .map((x) => x),
            'rawPosition'
          ),
        ]) {
          let currentCategory: YPCategory = {
            name: category?.name ?? null,
            channels: [],
          }

          currentCategory.channels = await Promise.all(
            guild.channels.cache
              .filter(
                (x) => x.isText() && x.parentId === (category?.id ?? null)
              )
              .map(async (x) => ({
                id: x.id,
                name: x.name,
                rules:
                  (
                    await prisma.channel.findUnique({
                      where: { id: x.id },
                      include: { rules: true },
                    })
                  )?.rules.map((x) => ({ id: x.id, name: x.name })) ?? [],
              }))
          )
          if (currentCategory.channels.length) {
            categories.push(currentCategory)
          }
        }
      }

      return {
        id: x.id,
        name: x.name,
        owner: x.owner,
        joined: !!guild,
        icon: x.icon
          ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.png?size=512`
          : null,
        channels: categories,
      } as YPGuild
    })
  )
}
