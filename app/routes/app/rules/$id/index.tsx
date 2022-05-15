import { Save } from '@mui/icons-material'
import { Stack, FormControl, FormControlLabel, Box } from '@mui/material'
import { Prisma } from '@prisma/client'
import { ActionFunction, redirect } from '@remix-run/server-runtime'
import { withZod } from '@remix-validated-form/with-zod'
import React from 'react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { SubmitButton } from '~/components/app/forms/SubmitButton'
import { ValidatedCheckbox } from '~/components/app/forms/ValidatedCheckbox'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { prisma } from '~/db.server'
import { getUser } from '~/session.server'
import { useCurrentRule } from '~/util/rules'
import { useUser } from '~/utils'

const validator = withZod(
  z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    isOfficial: zfd.checkbox().optional(),
  })
)

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)

  if (!user) return { error: 'unauthorized' }

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

const MetadataArea: React.FC = () => {
  const user = useUser()

  const rule = useCurrentRule()

  return (
    <ValidatedForm validator={validator} defaultValues={rule} method="post">
      <Stack direction="column" spacing={2}>
        <ValidatedTextField
          name="name"
          label="이름"
          fullWidth
          variant="standard"
        />
        <ValidatedTextField
          name="description"
          label="설명"
          fullWidth
          variant="standard"
        />
        {user.admin && (
          <>
            <FormControl>
              <FormControlLabel
                control={<ValidatedCheckbox name="isOfficial" />}
                label="공식"
              />
            </FormControl>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <SubmitButton startIcon={<Save />} variant="outlined">
          저장
        </SubmitButton>
      </Stack>
    </ValidatedForm>
  )
}

export default MetadataArea
