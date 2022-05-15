import { Breadcrumbs, Link, Paper, Stack, Typography } from '@mui/material'
import { NavLink, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { getUser } from '~/session.server'
import { prisma } from '~/db.server'
import { SubmitButton } from '~/components/app/forms/SubmitButton'

export const validator = withZod(
  z.object({
    code: z.string(),
  })
)

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

  const res = await validator.validate(await request.formData())

  if (res.error) {
    return validationError(res.error)
  }
  const invite = await prisma.shareCode.findUnique({
    where: { id: res.data.code },
  })

  if (!invite) {
    return validationError({
      fieldErrors: {
        code: '코드를 찾을 수 없습니다',
      },
    })
  }

  if (invite.maxCounts !== 0 && invite.maxCounts <= invite.count + 1) {
    await prisma.shareCode.delete({
      where: { id: invite.id },
    })
  } else {
    await prisma.shareCode.update({
      where: {
        id: invite.id,
      },
      data: {
        count: { increment: 1 },
      },
    })
  }

  await prisma.rule.update({
    where: {
      id: invite.ruleId,
    },
    data: {
      sharedUser: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  return redirect('/app/rules')
}

export default function AddSharedRulePage() {
  const transition = useTransition()

  const submitting = transition.state === 'submitting'

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
          공유
        </Typography>
      </Breadcrumbs>
      <ValidatedForm validator={validator} method="post">
        <Paper
          variant="outlined"
          sx={{ maxWidth: 400, mx: 'auto', p: 2, mt: 2 }}
        >
          <Stack direction="column" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              공유받은 규칙 가져오기
            </Typography>
            <ValidatedTextField
              label="공유 코드"
              name="code"
              fullWidth
              variant="standard"
            />
            <SubmitButton variant="outlined" fullWidth loading={submitting}>
              가져오기
            </SubmitButton>
          </Stack>
        </Paper>
      </ValidatedForm>
    </div>
  )
}
