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
import type { Prisma } from '@prisma/client'
import {
  NavLink,
  Outlet,
  useMatches,
  Link as RouterLink,
} from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'
import { useCurrentRule } from '~/util/rules'
import React from 'react'
import { Save } from '@mui/icons-material'
import { SubmitButton } from '~/components/app/forms/SubmitButton'

const validator = withZod(
  z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    isOfficial: zfd.checkbox().optional(),
  })
)

export const action: ActionFunction = async ({ request, params }) => {
  const user = (await getUser(request))!

  const rule = await prisma.rule.findFirst({
    where: { id: params.id, authorId: user.id },
  })

  if (!rule) return redirect('/rules')

  const res = await validator.validate(await request.formData())
  if (res.error) {
    return validationError(res.error)
  }
  const { data } = res

  const updateArgs: Prisma.RuleUpdateInput = {
    name: data.name,
    description: data.description,
  }

  if (user.admin) {
    updateArgs.isOfficial = data.isOfficial ?? false
  }

  await prisma.rule.update({
    where: {
      id: rule.id,
    },
    data: updateArgs,
  })
  return {}
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `rule-editor-tabpanel-${index}`,
  }
}

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
      <ValidatedForm validator={validator} defaultValues={rule} method="post">
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="flex-end">
            <Typography variant="h6">{rule.name}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <SubmitButton startIcon={<Save />} variant="outlined">
              저장
            </SubmitButton>
          </Stack>
          <Paper
            sx={{ display: 'flex', height: 400, mt: 2 }}
            variant="outlined"
          >
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
      </ValidatedForm>
    </div>
  )
}
