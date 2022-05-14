import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getGuildList } from '~/models/guild.server'

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = params.id

  const guilds = await getGuildList(request)

  const guild = guilds?.find((x) => x.id === id)

  if (!guild) return redirect('/app')

  if (guild.joined) return redirect(`/app/invite/${guild.id}`)

  return redirect(
    `https://discord.com/api/oauth2/authorize?${new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      scope: 'bot',
      redirect_uri: process.env.DISCORD_CLIENT_INVITE_CALLBACK!,
      permissions: '8',
      guild_id: guild.id,
      disable_guild_select: 'true',
      response_type: 'code',
    })}`
  )
}
