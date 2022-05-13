import type { User } from '@prisma/client'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { prisma } from '~/db.server'

const discordApi = axios.create({ baseURL: 'https://discord.com/api/v9' })

discordApi.interceptors.response.use(undefined, (err: AxiosError) => {
  if (err.response?.status === 429) {
    const retryAfter = err.response.headers['x-retry-after']
    return new Promise((resolve) =>
      setTimeout(resolve, Number(retryAfter) * 1000)
    ).then(() => discordApi(err.config))
  }

  throw err
})

export async function getToken(user: User) {
  if (user.discordTokenExpiresAt.getTime() < Date.now()) {
    const { data } = await discordApi.post<DiscordTokenResponse>(
      '/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: user.discordRefreshToken,
      })
    )
    prisma.user.update({
      where: { id: user.id },
      data: {
        discordAccessToken: data.access_token,
        discordRefreshToken: data.refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    })

    return `Bearer ${user.discordAccessToken}`
  }
  return `Bearer ${user.discordAccessToken}`
}

export type DiscordTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
}

export { discordApi }
