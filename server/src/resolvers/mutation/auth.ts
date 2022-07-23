import { UserInputError } from "apollo-server"
import { discordApi, jwtToken } from "../../utils"
import {
  RESTGetAPICurrentUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "discord-api-types/v10"
import { prisma } from "shared"
import jwt from "jsonwebtoken"
import { logger } from "../../logger"
import { AxiosError } from "axios"

export const login = async (_: unknown, { code }: { code: string }) => {
  try {
    const { data: tokens } =
      await discordApi.post<RESTPostOAuth2AccessTokenResult>(
        "/oauth2/token",
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          redirect_uri: process.env.DISCORD_REDIRECT_URI!,
          grant_type: "authorization_code",
          code,
        })
      )

    const { data: user } = await discordApi.get<RESTGetAPICurrentUserResult>(
      "/users/@me",
      {
        headers: { authorization: `Bearer ${tokens.access_token}` },
      }
    )

    const { id } = await prisma.user.upsert({
      select: {
        id: true,
      },
      create: {
        id: user.id,
        discordAccessToken: tokens.access_token,
        discordRefreshToken: tokens.refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      update: {
        discordAccessToken: tokens.access_token,
        discordRefreshToken: tokens.refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      },
      where: { id: user.id },
    })

    const token = jwt.sign({ id }, jwtToken(), {
      expiresIn: "7d",
    })

    return token
  } catch (e) {
    logger.error((e as AxiosError).response?.data ?? e)
    throw new UserInputError("Invalid code")
  }
}
