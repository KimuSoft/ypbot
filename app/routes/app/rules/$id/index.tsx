import { Save } from '@mui/icons-material'
import {
  Paper,
  Stack,
  Tab,
  Tabs,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Prisma } from '@prisma/client'
import { ActionFunction, redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import React from 'react'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
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

const MetadataArea: React.FC = () => {
  const user = useUser()
  return (
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
    </Stack>
  )
}

export default function RuleEdit() {
  const rule = useCurrentRule()

  React.useEffect(() => console.log(rule), [rule])

  const [currentTab, setCurrentTab] = React.useState(0)

  return (
    <div>
      <ValidatedForm validator={validator} defaultValues={rule} method="post">
        <Button startIcon={<Save />} type="submit">
          저장
        </Button>
        <Paper sx={{ display: 'flex', height: 400 }} variant="outlined">
          <Tabs
            orientation="vertical"
            value={currentTab}
            sx={{ borderRight: 1, borderColor: 'divider' }}
            onChange={(_, v) => setCurrentTab(v)}
          >
            <Tab label="메타데이터" {...a11yProps(0)} />
            <Tab label="금지 규칙" {...a11yProps(1)} />
            <Tab label="강제 규칙" {...a11yProps(2)} />
            <Tab label="포함 규칙" {...a11yProps(3)} />
            <Tab label="공유" {...a11yProps(4)} />
          </Tabs>
          <Box sx={{ flexGrow: 1, width: 0, p: 2 }}>
            {currentTab === 0 && <MetadataArea />}
          </Box>
        </Paper>
      </ValidatedForm>
    </div>
  )
}
