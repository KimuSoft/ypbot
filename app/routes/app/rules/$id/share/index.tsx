import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { ShareCode } from '@prisma/client'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import type { ActionFunction, LoaderFunction } from '@remix-run/server-runtime'
import { redirect } from '@remix-run/server-runtime'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'
import React from 'react'
import { Add, CopyAll, Delete } from '@mui/icons-material'
import { SubmitButton } from '~/components/app/forms/SubmitButton'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { zfd } from 'zod-form-data'
import { toast } from 'react-toastify'

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

  const id = params.id
  const item = await prisma.rule.findFirst({
    where: { id, authorId: user.id },
    include: { shareCodes: true },
  })

  if (!item) return redirect('/app/rules')

  return {
    codes: item.shareCodes,
  }
}

const createValidator = withZod(
  z.object({
    maxCount: zfd.numeric(z.number().min(0).max(1000).int()),
  })
)

export const action: ActionFunction = async ({ params, request }) => {
  const res = await createValidator.validate(await request.formData())

  if (res.error) {
    return validationError(res.error)
  }

  const { data } = res

  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

  const id = params.id
  const item = await prisma.rule.findFirst({
    where: { id, authorId: user.id },
  })

  if (!item) return redirect('/app/rules')

  const share = await prisma.shareCode.create({
    data: {
      maxCounts: data.maxCount,
      count: 0,
      ruleId: item.id,
    },
  })

  console.log(share)

  return { value: share.id }
}

export default function ShareSettings() {
  const { codes } = useLoaderData<{ codes: ShareCode[] }>()
  const [open, setOpen] = React.useState(false)

  const data = useActionData()

  const [toCopy, setToCopy] = React.useState<string | null>(null)

  React.useEffect(() => {
    setOpen(false)
  }, [data])

  return (
    <div>
      <Dialog open={open}>
        <ValidatedForm
          method="post"
          validator={createValidator}
          defaultValues={{ maxCount: 0 }}
        >
          <DialogTitle>공유 코드 만들기</DialogTitle>
          <DialogContent>
            <ValidatedTextField
              label="최대 사용 횟수"
              helperText="0 - 제한 없음"
              name="maxCount"
              type="number"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={() => setOpen(false)}>
              취소
            </Button>
            <SubmitButton>만들기</SubmitButton>
          </DialogActions>
        </ValidatedForm>
      </Dialog>
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          공유 코드 관리
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          startIcon={<Add />}
        >
          추가하기
        </Button>
      </Stack>
      {data?.value && (
        <Alert severity="success" sx={{ mt: 2 }}>
          초대 코드: {data?.value}
        </Alert>
      )}
      {toCopy && (
        <Alert severity="error" sx={{ mt: 2 }}>
          초대 코드 복사에 실패했습니다. 링크: {toCopy}
        </Alert>
      )}
      {(codes.length && (
        <Paper variant="outlined" sx={{ mt: 2 }}>
          <List sx={{ p: 0 }}>
            {codes.map((x, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={x.id}
                  secondary={`사용 횟수: ${x.count} ${
                    x.maxCounts === 0 ? '' : `/ ${x.maxCounts}`
                  }`}
                />
                <ListItemSecondaryAction>
                  <Form action="delete" method="post">
                    <input type="hidden" value={x.id} name="id" />
                    <IconButton
                      sx={{ mr: 1 }}
                      onClick={async () => {
                        setToCopy(null)
                        const link = `${window.location.protocol}//${window.location.host}/app/rules/new/shared?code=${x.id}`
                        if (window.isSecureContext) {
                          await navigator.clipboard.writeText(link)
                          toast.success('복사되었습니다.')
                        } else {
                          setToCopy(link)
                        }
                      }}
                    >
                      <CopyAll />
                    </IconButton>
                    <IconButton type="submit">
                      <Delete />
                    </IconButton>
                  </Form>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )) ||
        null}
    </div>
  )
}
