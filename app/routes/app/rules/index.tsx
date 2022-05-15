import { Add, Edit, ExpandMore, Share } from '@mui/icons-material'
import {
  Box,
  Breadcrumbs,
  Button,
  Collapse,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { Rule } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { NavLink, useLoaderData, Link as RouterLink } from '@remix-run/react'
import React from 'react'
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
    officialRules: await prisma.rule.findMany({
      where: {
        isOfficial: true,
      },
    }),
  }
}

type RuleType = 'owner' | 'shared' | 'official'

const RuleItem: React.FC<{ rule: Rule; type: RuleType }> = ({ rule, type }) => {
  return (
    <Paper variant="outlined">
      <ListItem>
        <ListItemText primary={rule.name} secondary={rule.description} />
        <Stack direction="row" spacing={2}>
          <Box sx={{ flexGrow: 1 }} />
          {type === 'owner' && (
            <IconButton size="small" component={RouterLink} to={rule.id}>
              <Edit />
            </IconButton>
          )}
          {type === 'owner' && (
            <IconButton
              size="small"
              component={RouterLink}
              to={`${rule.id}/share`}
            >
              <Share />
            </IconButton>
          )}
        </Stack>
      </ListItem>
    </Paper>
  )
}

const RuleGroup: React.FC<{
  title: React.ReactNode
  rules: Rule[]
  type: RuleType
}> = ({ title, rules, type }) => {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <Paper variant="outlined">
      <List sx={{ p: 0 }}>
        <ListItem>
          <ListItemText primary={title} />
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => setExpanded((v) => !v)}
              sx={{
                transition: (theme) => theme.transitions.create('transform'),
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMore />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {rules.map((x, i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <RuleItem type={type} rule={x} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default function RulesPage() {
  const { rules, sharedRules, officialRules } = useLoaderData<{
    rules: Rule[]
    sharedRules: Rule[]
    officialRules: Rule[]
  }>()

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
      <Stack direction="row" sx={{ mt: 2 }} alignItems="center" spacing={2}>
        <Typography variant="h4" fontWeight={600}>
          규칙 관리
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          startIcon={<Share />}
          variant="outlined"
          component={RouterLink}
          to="new/shared"
        >
          규칙 공유받기
        </Button>
        <Button
          startIcon={<Add />}
          variant="outlined"
          component={RouterLink}
          to="new"
        >
          만들기
        </Button>
      </Stack>
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        <RuleGroup type="owner" title="내 규칙" rules={rules} />
        <RuleGroup type="shared" title="공유받은 규칙" rules={sharedRules} />
        <RuleGroup type="official" title="공식 규칙" rules={officialRules} />
      </Stack>
    </div>
  )
}
