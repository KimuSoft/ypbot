import { decode, encode } from '@msgpack/msgpack'
import { User } from '@ypbot/database'
import { APIGuild } from 'discord-api-types/v10.js'
import { FastifyRequest } from 'fastify'

import { discordApi } from './api.js'
import { getUserDiscordAccessToken } from './auth.js'
import { redis } from './redis.js'

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
