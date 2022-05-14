import { Dns } from '@mui/icons-material'
import { Avatar, Breadcrumbs, Link, Stack, Typography } from '@mui/material'
import { NavLink } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { getGuildList } from '~/models/guild.server'
import { useCurrentGuild } from '~/util/guilds'

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id

  const guilds = await getGuildList(request)

  const guild = guilds?.find((x) => x.id === id)

  if (!guild) return redirect('/app')

  if (!guild.joined) return redirect(`/app/invite/${guild.id}`)

  return { guild }
}

export default function GuildLayout() {
  const guild = useCurrentGuild()

  return (
    <div>
      <Breadcrumbs>
        <Link component={NavLink} to="/app" underline="hover" color="inherit">
          YPBOT
        </Link>
        <Typography color="text.primary" component="div">
          <Stack direction="row" spacing={1}>
            <Avatar
              src={guild.icon || undefined}
              sx={{ width: 20, height: 20 }}
            >
              <Dns sx={{ width: 12, height: 12 }} />
            </Avatar>
            <span>{guild.name}</span>
          </Stack>
        </Typography>
      </Breadcrumbs>
    </div>
  )
}
