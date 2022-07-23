import axios, { AxiosError } from "axios"
import {
  RESTGetAPICurrentUserResult,
  RESTPostOAuth2AccessTokenResult,
} from "discord-api-types/v10"
import { GraphQLFieldResolver } from "graphql"
import { prisma, User, YPUser } from "shared"
import { TLRU } from "tlru"

export const discordApi = axios.create({
  baseURL: "https://discord.com/api/v10",
})

discordApi.interceptors.response.use(
  (v) => v,
  (err: AxiosError) => {
    if (err.response?.status === 429) {
      return new Promise((resolve) =>
        setTimeout(resolve, Number(err.response!.headers["retry-after"]) * 1000)
      ).then(() => discordApi.request(err.config))
    }

    return Promise.reject(err)
  }
)

export const jwtToken = () => process.env.JWT_TOKEN!

export type UserContext = {
  user: User | null
}

export type Resolver<T, S = unknown> = GraphQLFieldResolver<S, UserContext, T>

export const getToken = async (user: User) => {
  if (user.discordTokenExpiresAt.getTime() > Date.now()) {
    return user.discordAccessToken
  }

  const { data: tokens } =
    await discordApi.post<RESTPostOAuth2AccessTokenResult>(
      "/oauth2/token",
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: user.discordRefreshToken,
      })
    )

  await prisma.user.update({
    where: { id: user.id },
    data: {
      discordAccessToken: tokens.access_token,
      discordRefreshToken: tokens.refresh_token,
      discordTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  })

  return tokens.access_token
}

const userCache = new TLRU<string, YPUser>({
  maxStoreSize: 1000,
  maxAgeMs: 1000 * 60 * 10,
})

export const fetchUser = async (user: User): Promise<YPUser> => {
  if (userCache.has(user.id)) return userCache.get(user.id)!

  const token = await getToken(user)
  const { data } = await discordApi.get<RESTGetAPICurrentUserResult>(
    "/users/@me",
    { headers: { authorization: `Bearer ${token}` } }
  )

  const avatar = data.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${data.avatar}.webp?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${
        Number(data.discriminator) % 4
      }.png`

  const result: YPUser = {
    id: user.id,
    username: data.username,
    discriminator: data.discriminator,
    tag: `${data.username}#${data.discriminator}`,
    avatar,
  }

  userCache.set(user.id, result)

  return result
}
