import { User } from '@ypbot/database'
import { RESTPostOAuth2RefreshTokenResult } from 'discord-api-types/v10.js'
import { FastifyRequest, RouteGenericInterface, RouteHandler } from 'fastify'

import { discordApi } from './api.js'

export const requireAuth = <T extends RouteGenericInterface>(handler: RouteHandler<T>) => {
  return (async (req, reply) => {
    if (!req.user) return reply.status(401).send(new Error('Unauthorized') as never)

    return handler.bind(req.server)(req, reply)
  }) as RouteHandler<T>
}

export const getUserDiscordAccessToken = async (req: FastifyRequest, user: User) => {
  if (user.discordTokenExpiresAt.getTime() > Date.now()) return user.discordAccessToken

  const { data: tokens } = await discordApi.post<RESTPostOAuth2RefreshTokenResult>(
    '/oauth2/token',
    new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: user.discordRefreshToken,
    })
  )

  user.discordAccessToken = tokens.access_token
  user.discordRefreshToken = tokens.refresh_token
  user.discordTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await req.em.persistAndFlush(user)

  return user.discordAccessToken
}
