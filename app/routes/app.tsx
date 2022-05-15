import { Box, Container, Toolbar } from '@mui/material'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { AppHeader } from '~/components/app/layout/Header'
import { getGuildList } from '~/models/guild.server'
import { getUserById } from '~/models/user.server'
import { getUserId } from '~/session.server'

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
  return (
    <div style={{ height: '100vh' }}>
      <AppHeader />
      <Container
        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Toolbar />
        <Box sx={{ py: 3, flexGrow: 1, height: 0, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Container>
    </div>
  )
}
