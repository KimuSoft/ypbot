import { TLRU } from 'tlru'
import { discordApi, getToken } from '~/discordApi.server'
import { getUser } from '~/session.server'
import type { User } from './user.server'

export type YPGuild = {
  id: string
  name: string
  owner: boolean
  joined: boolean
  icon: string | null
}

const guildsCache = new TLRU<User['id'], YPGuild[]>({ maxAgeMs: 10000 })

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

  return withPerms.map(
    (x) =>
      ({
        id: x.id,
        name: x.name,
        owner: x.owner,
        joined: cts.client.guilds.cache.has(x.id),
        icon: x.icon
          ? `https://cdn.discordapp.com/icons/${x.id}/${x.icon}.png?size=512`
          : null,
      } as YPGuild)
  )
}
