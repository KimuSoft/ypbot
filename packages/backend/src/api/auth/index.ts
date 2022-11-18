import type { Static } from '@sinclair/typebox'
import { Type }        from '@sinclair/typebox'
import { User }        from '@ypbot/database'
import { jwtSecret }   from 'backend/src/config.js'
import { discordApi }  from 'backend/src/utils/api.js'
import type {
  RESTGetAPIUserResult,
  RESTPostOAuth2AccessTokenResult
} from 'discord-api-types/v10'
import {
  Routes
} from 'discord-api-types/v10'
import type { FastifyPluginAsync } from 'fastify'
import jwt                         from 'jsonwebtoken'

const LoginData = Type.Object({
  code: Type.String()
})

const LoginResponseData = Type.Object({
  token: Type.String()
})

if (process.env.DISCORD_CLIENT_ID === undefined) throw new Error('DISCORD_CLIENT_ID is undefined')
if (process.env.DISCORD_CLIENT_SECRET === undefined) throw new Error('DISCORD_CLIENT_SECRET is undefined')
if (process.env.DISCORD_REDIRECT_URI === undefined) throw new Error('DISCORD_REDIRECT_URI is undefined')

const discordClientId = process.env.DISCORD_CLIENT_ID
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
const discordRedirectUri = process.env.DISCORD_REDIRECT_URI

export const authRoutes: FastifyPluginAsync = async (server) => {
  server.get('/login', async (_req, reply) => {
    return await reply.redirect(
      302,
      `https://discord.com/api/v10/oauth2/authorize?${new URLSearchParams({
        client_id: discordClientId,
        scope: 'identify guilds',
        response_type: 'code',
        redirect_uri: discordRedirectUri
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
          200: LoginResponseData
        }
      }
    },
    async (req, reply) => {
      const { data: tokens } = await discordApi.post<RESTPostOAuth2AccessTokenResult>(
        Routes.oauth2TokenExchange(),
        new URLSearchParams({
          client_id: discordClientId,
          client_secret: discordClientSecret,
          grant_type: 'authorization_code',
          redirect_uri: discordRedirectUri,
          code: req.body.code
        })
      )

      const discordUser = (
        await discordApi.get<RESTGetAPIUserResult>(Routes.user(), {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        })
      ).data

      const UserRepo = req.em.getRepository(User)

      let user: User | null = await UserRepo.findOne({
        id: discordUser.id
      })

      if (user == null) {
        user = new User()

        user.id = discordUser.id
      }

      user.username = discordUser.username
      user.discriminator = discordUser.discriminator
      user.avatar = discordUser.avatar ?? null

      user.discordAccessToken = tokens.access_token
      user.discordRefreshToken = tokens.refresh_token
      user.discordTokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)

      user.banner = discordUser.banner ?? null
      user.accentColor = discordUser.accent_color ?? undefined

      await req.em.persistAndFlush(user)

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' })

      return await reply.status(200).send({ token })
    }
  )
}
