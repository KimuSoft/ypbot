import _ from 'lodash'
import { TLRU } from 'tlru'
import { discordApi, getToken } from '~/discordApi.server'
import { getUser } from '~/session.server'
import type { User } from './user.server'

export type YPChannel = {
  id: string
  name: string
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

export const getGuildList = async (
  req: Request
): Promise<YPGuild[] | undefined> => {
  const user = await getUser(req)

  if (!user) return

  const existing = guildsCache.get(user.id)
  if (existing) return existing

  const { data: guilds } = await discordApi.get<any[]>('/users/@me/guilds', {
    headers: { Authorization: await getToken(user) },
  })

  const withPerms = guilds.filter((x) => (Number(x.permissions) & 8) === 8)

  return withPerms.map((x) => {
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

        currentCategory.channels = guild.channels.cache
          .filter((x) => x.isText() && x.parentId === (category?.id ?? null))
          .map((x) => ({
            id: x.id,
            name: x.name,
          }))
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
}
