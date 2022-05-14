import { Box, Breadcrumbs, Link, Typography } from '@mui/material'
import { NavLink, Outlet } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'
import { useCurrentRule } from '~/util/rules'

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = (await getUser(request))!

  const id = params.id
  const item = await prisma.rule.findFirst({
    where: { id, authorId: user.id },
    include: { elements: true },
  })
  if (!item) return redirect('/app/rules')
  return {
    rule: item,
  }
}

export default function RuleLayout() {
  const rule = useCurrentRule()

  return (
    <div>
      <Breadcrumbs>
        <Link component={NavLink} to="/app" underline="hover" color="inherit">
          YPBOT
        </Link>
        <Link
          component={NavLink}
          to="/app/rules"
          underline="hover"
          color="inherit"
        >
          규칙
        </Link>
        <Typography color="text.primary" component="div">
          {rule.name}
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </div>
  )
}
