import { Box, Container, Toolbar } from '@mui/material'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppHeader } from '~/components/app/layout/Header'
import { getGuildList } from '~/models/guild.server'
import { getUserById } from '~/models/user.server'
import { getUserId } from '~/session.server'
import { useGuildList } from '~/util/guilds'

export const loader: LoaderFunction = async ({ request }) => {
  const id = await getUserId(request)
  if (!id) return redirect('/login')
  const user = await getUserById(id)
  if (!user) return redirect('/login')

  const guilds = (await getGuildList(request))!

  return {
    guilds,
  }
}

export default function App() {
  const guilds = useGuildList()

  console.log(guilds)

  return (
    <div>
      <AppHeader />
      <Container>
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Container>
    </div>
  )
}
