import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import type { DiscordTokenResponse } from '~/discordApi.server'
import { discordApi } from '~/discordApi.server'
import { guildsCache } from '~/models/guild.server'
import { getUser } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) return redirect('/')

  const url = new URL(request.url)

  const code = url.searchParams.get('code')

  if (!code) return redirect('/app')

  const { data } = await discordApi.post<
    DiscordTokenResponse & { guild: { id: string } }
  >(
    '/oauth2/token',
    new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      redirect_uri: process.env.DISCORD_CLIENT_INVITE_CALLBACK!,
      grant_type: 'authorization_code',
      code,
    })
  )

  guildsCache.delete(user.id)

  return redirect(`/app/guilds/${data.guild.id}`)
}
