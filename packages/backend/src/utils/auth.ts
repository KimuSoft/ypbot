import type { User }                                                from '@ypbot/database'
import { discordApi }                                               from 'backend/src/utils/api.js'
import type { RESTPostOAuth2RefreshTokenResult }                    from 'discord-api-types/v10.js'
import type { FastifyRequest, RouteGenericInterface, RouteHandler } from 'fastify'

export const requireAuth = <T extends RouteGenericInterface>(handler?: RouteHandler<T>): RouteHandler<T> => {
  return (async (req, reply) => {
    if (req.user == null) return await reply.status(401).send(new Error('Unauthorized') as never)

    return await handler?.bind(req.server)(req, reply)
  }) as RouteHandler<T>
}

if (process.env.DISCORD_CLIENT_ID === undefined) throw new Error('DISCORD_CLIENT_ID is undefined')
if (process.env.DISCORD_CLIENT_SECRET === undefined) throw new Error('DISCORD_CLIENT_SECRET is undefined')

const discordClientId = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET

export const getUserDiscordAccessToken = async (req: FastifyRequest, user: User): Promise<string> => {
  if (user.discordTokenExpiresAt.getTime() > Date.now()) return user.discordAccessToken

  const { data: tokens } = await discordApi.post<RESTPostOAuth2RefreshTokenResult>(
    '/oauth2/token',
    new URLSearchParams({
      client_id: discordClientId,
      client_secret: discordClientSecret,
      grant_type: 'refresh_token',
      refresh_token: user.discordRefreshToken
    })
  )

  user.discordAccessToken = tokens.access_token
  user.discordRefreshToken = tokens.refresh_token
  user.discordTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  await req.em.persistAndFlush(user)

  return user.discordAccessToken
}
