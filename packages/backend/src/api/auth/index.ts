import { Static, Type } from '@sinclair/typebox'
import { User, orm } from '@ypbot/database'
import {
  APIUser,
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult,
  Routes,
} from 'discord-api-types/v10'
import { FastifyPluginAsync } from 'fastify'
import jwt from 'jsonwebtoken'

import { jwtSecret } from '../../config.js'
import { discordApi } from '../../utils/api.js'

const LoginData = Type.Object({
  code: Type.String(),
})

const LoginResponseData = Type.Object({
  token: Type.String(),
})

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.get('/login', async (_req, reply) => {
    return reply.redirect(
      302,
      `https://discord.com/api/v10/oauth2/authorize?${new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        scope: 'identify guilds',
        response_type: 'code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      })}`
    )
  })
  server.post<{
    Body: Static<typeof LoginData>
  }>(
    '/login',
    {
      schema: {
        body: LoginData,
        response: {
          200: LoginResponseData,
        },
      },
    },
    async (req, reply) => {
      const { data: tokens } = await discordApi.post<RESTPostOAuth2AccessTokenResult>(
        Routes.oauth2TokenExchange(),
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: 'authorization_code',
          redirect_uri: process.env.DISCORD_REDIRECT_URI!,
          code: req.body.code,
        })
      )

      const discordUser = (
        await discordApi.get<RESTGetAPIUserResult>(Routes.user(), {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
      ).data as APIUser

      const UserRepo = req.em.getRepository(User)

      let user: User | null = await UserRepo.findOne({
        id: discordUser.id,
      })

      if (!user) {
        user = new User()

        user.id = discordUser.id
      }

      user.username = discordUser.username
      user.discriminator = discordUser.discriminator
      user.avatar = discordUser.avatar ?? undefined

      user.discordAccessToken = tokens.access_token
      user.discordRefreshToken = tokens.refresh_token
      user.discordTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

      user.banner = discordUser.banner ?? undefined
      user.accentColor = discordUser.accent_color ?? undefined

      await req.em.persistAndFlush(user)

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' })

      return reply.status(200).send({ token })
    }
  )
}
