import { Paper, Stack, TextField, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Form, useTransition } from '@remix-run/react'
import { ActionFunction, redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'

export const validator = withZod(
  z.object({
    name: z.string().min(2),
    description: z.string().min(10),
  })
)

export const action: ActionFunction = async ({ request }) => {
  const user = (await getUser(request))!

  const res = await validator.validate(await request.formData())

  if (res.error) {
    return validationError(res.error)
  }

  const { data } = res

  const { id } = await prisma.rule.create({
    data: {
      name: data.name,
      description: data.description,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  return redirect(`/app/rules/${id}`)
}

export default function NewRulePage() {
  const transition = useTransition()

  const submitting = transition.state === 'submitting'

  return (
    <div>
      <ValidatedForm validator={validator} method="post">
        <Paper variant="outlined" sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
          <Stack direction="column" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              규칙 만들기
            </Typography>
            <ValidatedTextField
              label="이름"
              disabled={submitting}
              name="name"
              fullWidth
              variant="standard"
            />
            <ValidatedTextField
              label="설명"
              name="description"
              fullWidth
              variant="standard"
              disabled={submitting}
            />
            <LoadingButton
              variant="outlined"
              fullWidth
              loading={submitting}
              type="submit"
            >
              만들기
            </LoadingButton>
          </Stack>
        </Paper>
      </ValidatedForm>
    </div>
  )
}
