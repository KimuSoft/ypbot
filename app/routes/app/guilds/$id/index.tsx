import { Add, ExpandMore, Tag } from '@mui/icons-material'
import {
  Paper,
  Box,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  ListItemSecondaryAction,
  IconButton,
  List,
  Grid,
  Stack,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Autocomplete,
  Popover,
  TextField,
  Chip,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import type { Rule } from '@prisma/client'
import { useLoaderData, useTransition } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import React from 'react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { SubmitButton } from '~/components/app/forms/SubmitButton'
import { prisma } from '~/db.server'
import type { YPCategory, YPChannel } from '~/models/guild.server'
import { guildsCache } from '~/models/guild.server'
import { getGuildList } from '~/models/guild.server'
import { getUser } from '~/session.server'
import { useCurrentGuild } from '~/util/guilds'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) return redirect('/app')

  return {
    rules: await prisma.rule.findMany({
      where: {
        OR: [
          {
            authorId: user.id,
          },
          {
            isOfficial: true,
          },
          {
            sharedUser: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
    }),
  }
}

const validator = withZod(
  z.object({
    type: z.union([z.literal('addRule'), z.literal('removeRule')]),
    channel: z.string(),
    rule: z.string(),
  })
)

export const action: ActionFunction = async ({ params, request }) => {
  const user = await getUser(request)

  if (!user) return redirect('/app')

  const res = await validator.validate(await request.formData())

  if (res.error) {
    return validationError(res.error)
  }

  const { data } = res

  const guilds = await getGuildList(request)

  const guild = guilds?.find(
    (x) =>
      x.id === params.id &&
      x.joined &&
      !!x.channels.find((y) => !!y.channels.find((x) => x.id === data.channel))
  )

  if (!guild) return redirect('/app')

  if (data.type === 'addRule') {
    await prisma.channel.upsert({
      where: {
        id: data.channel,
      },
      create: {
        id: data.channel,
        guildId: params.id!,
        rules: {
          connect: {
            id: data.rule,
          },
        },
      },
      update: {
        rules: {
          connect: {
            id: data.rule,
          },
        },
      },
    })
  } else if (data.type === 'removeRule') {
    await prisma.channel.upsert({
      where: {
        id: data.channel,
      },
      create: {
        id: data.channel,
        guildId: params.id!,
      },
      update: {
        rules: {
          disconnect: {
            id: data.rule,
          },
        },
      },
    })
  }

  guildsCache.delete(user.id)

  return redirect(`/app/guilds/${params.id!}`)
}

const RuleAddDialog: React.FC<{
  anchor: HTMLElement | null
  close: () => void
  channel: YPChannel
}> = ({ anchor, close, channel }) => {
  const { rules } = useLoaderData<{ rules: Rule[] }>()

  const [selected, setSelected] = React.useState<string | null>(null)

  const selectedRuleObj = React.useMemo(() => {
    const r = rules.find((x) => x.id === selected)
    if (!r) return null
    return {
      id: r.id,
      label: r.name,
    }
  }, [rules, selected])

  return (
    <Popover
      onClose={close}
      open={!!anchor}
      anchorEl={anchor}
      PaperProps={{ sx: { overflow: 'unset' } }}
    >
      <ValidatedForm
        method="post"
        validator={validator}
        onSubmit={() => {
          close()
        }}
      >
        <input type="hidden" name="type" value="addRule" />
        <input type="hidden" name="channel" value={channel.id} />
        {selected && <input type="hidden" name="rule" value={selected} />}
        <DialogTitle>규칙 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            채널{' '}
            <Paper
              variant="outlined"
              component="span"
              sx={{
                display: 'inline-block',
                py: '2px',
                px: '4px',
              }}
            >
              {channel.name}
            </Paper>{' '}
            에 규칙을 추가합니다. 추가할 규칙을 선택해주세요.
          </DialogContentText>
          <Autocomplete
            value={selectedRuleObj}
            isOptionEqualToValue={(a, b) => {
              return a.id === b.id
            }}
            onChange={(e, v) => {
              setSelected(v?.id || null)
            }}
            disablePortal
            options={rules
              .filter((x) => !channel.rules.find((y) => y.id === x.id))
              .map((x, i) => ({
                id: x.id,
                label: x.name,
              }))}
            renderOption={(props, x) => {
              return (
                <ListItem {...props} component="li">
                  <ListItemText primary={x.label} />
                </ListItem>
              )
            }}
            fullWidth
            sx={{ mt: 2 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="규칙"
                variant="standard"
                error={!selected}
                helperText={selected ? undefined : '규칙을 선택해 주세요'}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="error">
            취소
          </Button>
          <SubmitButton type="submit">추가하기</SubmitButton>
        </DialogActions>
      </ValidatedForm>
    </Popover>
  )
}

type RuleDeleteData = { id: string; channel: YPChannel; name: string }

const RuleDeleteDialog: React.FC<{
  anchor: HTMLElement | null
  close: () => void
  data: RuleDeleteData | null
}> = ({ anchor, close, data }) => {
  return (
    <Popover
      onClose={close}
      open={!!anchor}
      anchorEl={anchor}
      PaperProps={{ sx: { overflow: 'unset' } }}
    >
      {data && (
        <ValidatedForm
          method="post"
          validator={validator}
          onSubmit={() => {
            close()
          }}
        >
          <input type="hidden" name="type" value="removeRule" />
          <input type="hidden" name="channel" value={data.channel.id} />
          <input type="hidden" name="rule" value={data.id} />
          <DialogTitle>규칙 제거</DialogTitle>
          <DialogContent>
            <DialogContentText>
              채널{' '}
              <Paper
                variant="outlined"
                component="span"
                sx={{
                  display: 'inline-block',
                  py: '2px',
                  px: '4px',
                }}
              >
                {data.channel.name}
              </Paper>{' '}
              에서 규칙{' '}
              <Paper
                variant="outlined"
                component="span"
                sx={{
                  display: 'inline-block',
                  py: '2px',
                  px: '4px',
                }}
              >
                {data.name}
              </Paper>{' '}
              을(를) 제거합니다. 계속할까요?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>취소</Button>
            <SubmitButton type="submit" color="error">
              제거하기
            </SubmitButton>
          </DialogActions>
        </ValidatedForm>
      )}
    </Popover>
  )
}

const ChannelCard: React.FC<{ channel: YPChannel }> = ({ channel }) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
  const [toDelete, setToDelete] = React.useState<RuleDeleteData | null>(null)
  const [toDeleteAnchor, setToDeleteAnchor] =
    React.useState<HTMLElement | null>(null)

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2 }}
      component={Stack}
      direction="column"
      gap={2}
    >
      <RuleAddDialog
        close={() => setAnchor(null)}
        anchor={anchor}
        channel={channel}
      />
      <RuleDeleteDialog
        close={() => {
          setToDeleteAnchor(null)
          setToDelete(null)
        }}
        anchor={toDeleteAnchor}
        data={toDelete}
      />
      <Stack direction="row" gap={1} alignItems="center">
        <Tag sx={{ opacity: 0.6 }} />
        <Typography>{channel.name}</Typography>
      </Stack>
      <Box>
        <Grid container spacing={1}>
          {channel.rules.map((x, i) => (
            <Grid item key={i}>
              <Chip
                onDelete={(e) => {
                  setToDelete({
                    id: x.id,
                    name: x.name,
                    channel: channel,
                  })
                  setToDeleteAnchor(e.currentTarget)
                }}
                label={x.name}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Button
        variant="outlined"
        startIcon={<Add />}
        fullWidth
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        규칙 추가하기
      </Button>
    </Paper>
  )
}

const CategoryCollapse: React.FC<{ category: YPCategory }> = ({ category }) => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(true)
  }, [])

  return (
    <Box>
      <List sx={{ p: 0 }}>
        <ListItem>
          <ListItemText
            primary={category.name || '카테고리 없음'}
            secondary={`채널 ${category.channels.length}개`}
          />
          <ListItemSecondaryAction>
            <IconButton
              sx={{
                transition: (theme) => theme.transitions.create('transform'),
                transform: `rotation(${open ? 180 : 0}deg)`,
              }}
              onClick={() => setOpen((v) => !v)}
            >
              <ExpandMore />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <Collapse in={open}>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {category.channels.map((x, i) => (
              <Grid item key={i} xs={12} sm={6} md={4}>
                <ChannelCard channel={x} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Box>
  )
}

export default function GuildPage() {
  const guild = useCurrentGuild()
  const transition = useTransition()
  const submitting =
    transition.state === 'submitting' || transition.state === 'loading'

  return (
    <div>
      <Backdrop open={submitting} sx={{ zIndex: 99999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Paper variant="outlined">
        {guild.channels.map((x, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <Divider />}
            <CategoryCollapse category={x} />
          </React.Fragment>
        ))}
      </Paper>
    </div>
  )
}
