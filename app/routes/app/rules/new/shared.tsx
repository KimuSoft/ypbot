import { Breadcrumbs, Link, Paper, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { NavLink, useTransition } from '@remix-run/react'
import type { ActionFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { z } from 'zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { getUser } from '~/session.server'

export const validator = withZod(
  z.object({
    code: z.string(),
  })
)

export const action: ActionFunction = async ({ request }) => {
  const user = (await getUser(request))!

  const res = await validator.validate(await request.formData())

  if (res.error) {
    return validationError(res.error)
  }
  console.log(res)

  return {}
}

export default function NewRulePage() {
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
              disabled={submitting}
              name="code"
              fullWidth
              variant="standard"
            />
            <LoadingButton
              variant="outlined"
              fullWidth
              loading={submitting}
              type="submit"
            >
              가져오기
            </LoadingButton>
          </Stack>
        </Paper>
      </ValidatedForm>
    </div>
  )
}
