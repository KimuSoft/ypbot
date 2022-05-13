import { prisma } from '~/db.server'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import type { DiscordTokenResponse } from '~/discordApi.server'
import { discordApi } from '~/discordApi.server'
import { createUserSession } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
      const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        scope: 'identify guilds',
        redirect_uri: process.env.DISCORD_CLIENT_CALLBACK!,
        response_type: 'code',
      })
      return redirect('https://discord.com/api/oauth2/authorize?' + params)
    }

    const { data } = await discordApi.post<DiscordTokenResponse>(
      '/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        redirect_uri: process.env.DISCORD_CLIENT_CALLBACK!,
        grant_type: 'authorization_code',
        code,
      })
    )

    if (!data.scope.split(' ').every((x) => ['identify', 'guilds'].includes(x)))
      return { error: 'Invalid scope' }

    const { data: user } = await discordApi.get<{ id: string }>('/users/@me', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    })

    const { id } = await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        discordAccessToken: data.access_token,
        discordRefreshToken: data.refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
      update: {
        discordAccessToken: data.access_token,
        discordRefreshToken: data.refresh_token,
        discordTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    })

    return createUserSession({
      request,
      redirectTo: '/',
      remember: true,
      userId: id,
    })
  } catch (e: any) {
    return { error: e.message }
  }
}
