import { Add } from '@mui/icons-material'
import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import type { Rule } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { NavLink, useLoaderData, Link as RouterLink } from '@remix-run/react'
import { prisma } from '~/db.server'
import { getUserId } from '~/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const id = await getUserId(request)
  if (!id) return redirect('/login')
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: { rules: true, sharedRules: true },
  })

  if (!user) return redirect('/login')
  return {
    rules: user.rules,
    sharedRules: user.sharedRules,
  }
}

export default function RulesPage() {
  const rules = useLoaderData<{ rules: Rule[]; sharedRules: Rule[] }>()

  console.log(rules)

  return (
    <div>
      <Breadcrumbs>
        <Link component={NavLink} to="/app" underline="hover" color="inherit">
          YPBOT
        </Link>
        <Typography color="text.primary" component="div">
          규칙
        </Typography>
      </Breadcrumbs>
      <Stack direction="row" sx={{ mt: 2 }} alignItems="center">
        <Typography variant="h4" fontWeight={600}>
          규칙 관리
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<Add />}
          variant="outlined"
          component={RouterLink}
          to="new"
        >
          만들기
        </Button>
      </Stack>
    </div>
  )
}
