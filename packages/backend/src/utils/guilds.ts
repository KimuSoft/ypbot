import { decode, encode } from '@msgpack/msgpack'
import { User } from '@ypbot/database'
import { APIGuild } from 'discord-api-types/v10.js'
import { FastifyRequest } from 'fastify'

import { discordApi } from './api.js'
import { getUserDiscordAccessToken } from './auth.js'
import { redis } from './redis.js'
import { rpcFetch } from './rpc.js'

export const getUserGuild = async (
  req: FastifyRequest,
  user: User,
  id: string
): Promise<Omit<APIGuild, 'features'> | null> => {
  const key = `yp:user:${user.id}:guilds`

  const buf = await redis.hgetBuffer(key, id)

  let guild: Omit<APIGuild, 'features'> | null = null

  if (buf) {
    guild = decode(buf) as Omit<APIGuild, 'features'>
  } else {
    const guilds = await getUserGuilds(req, user)

    guild = guilds.find((x) => x.id === id) ?? null
  }

  if (!guild) return guild

  const fetchedGuild = await rpcFetch('lookupGuild', guild.id)

  if (!fetchedGuild) return null

  return { ...guild, ...fetchedGuild }
}

export const getUserGuilds = async (
  req: FastifyRequest,
  user: User
): Promise<Omit<APIGuild, 'features'>[]> => {
  const key = `yp:users:${user.id}:guilds`

  const data = await redis.hgetallBuffer(key)

  if (Object.keys(data).length) {
    return Object.values(data).map((x) => decode(x)) as Omit<APIGuild, 'features'>[]
  }

  const { data: guilds } = await discordApi.get('/users/@me/guilds', {
    headers: {
      authorization: `Bearer ${await getUserDiscordAccessToken(req, user)}`,
    },
  })

  for (const guild of guilds) {
    delete guild.features
  }

  let res: Omit<APIGuild, 'features'>[] = []

  for (const guild of guilds) {
    if ((guild.permissions & 8) === 8) {
      res.push(guild)
    }
  }

  await redis.hset(key, Object.fromEntries(res.map((x) => [x.id, Buffer.from(encode(x))])))

  await redis.expire(key, 60)

  return res
}
