import { decode, encode } from '@msgpack/msgpack'
import { User } from '@ypbot/database'
import { APIGuild } from 'discord-api-types/v10.js'
import { FastifyRequest } from 'fastify'

import { discordApi } from './api.js'
import { getUserDiscordAccessToken } from './auth.js'
import { redis } from './redis.js'

export const getUserGuilds = async (req: FastifyRequest, user: User) => {
  const key = `yp:users:${user.id}:guilds`

  const data = await redis.getBuffer(key)

  if (data) {
    return decode(data) as APIGuild[]
  }

  const { data: guilds } = await discordApi.get('/users/@me/guilds', {
    headers: {
      authorization: `Bearer ${await getUserDiscordAccessToken(req, user)}`,
    },
  })

  for (const guild of guilds) {
    delete guild.features
  }

  await redis.set(key, Buffer.from(encode(guilds)), 'EX', 30)

  return guilds
}
