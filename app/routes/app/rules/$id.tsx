import {
  Box,
  Breadcrumbs,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import {
  NavLink,
  Outlet,
  useMatches,
  Link as RouterLink,
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'
import { useCurrentRule } from '~/util/rules'
import React from 'react'

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `rule-editor-tabpanel-${index}`,
  }
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

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

const tabValues = [
  'routes/app/rules/$id/index',
  'routes/app/rules/$id/block',
  'routes/app/rules/$id/force',
  'routes/app/rules/$id/include',
  'routes/app/rules/$id/share',
]

export default function RuleLayout() {
  const rule = useCurrentRule()

  const matches = useMatches()

  const currentTab = React.useMemo(() => {
    return tabValues.findIndex((x) => !!matches.find((y) => y.id === x))
  }, [matches])

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
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
      <Box
        sx={{ mt: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}
      >
        <Stack direction="row" alignItems="flex-end">
          <Typography variant="h6">{rule.name}</Typography>
        </Stack>
        <Paper sx={{ display: 'flex', flexGrow: 1, mt: 2 }} variant="outlined">
          <Tabs
            orientation="vertical"
            value={currentTab}
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab
              component={RouterLink}
              to={`/app/rules/${rule.id}`}
              label="메타데이터"
              {...a11yProps(0)}
            />
            <Tab
              component={RouterLink}
              to={`/app/rules/${rule.id}/block`}
              label="금지 규칙"
              {...a11yProps(1)}
            />
            <Tab
              component={RouterLink}
              to={`/app/rules/${rule.id}/force`}
              label="강제 규칙"
              {...a11yProps(2)}
            />
            <Tab
              component={RouterLink}
              to={`/app/rules/${rule.id}/include`}
              label="포함 규칙"
              {...a11yProps(3)}
            />
            <Tab
              component={RouterLink}
              to={`/app/rules/${rule.id}/share`}
              label="공유"
              {...a11yProps(4)}
            />
          </Tabs>
          <Box sx={{ flexGrow: 1, width: 0, p: 2 }}>
            <Outlet />
          </Box>
        </Paper>
      </Box>
    </div>
  )
}
