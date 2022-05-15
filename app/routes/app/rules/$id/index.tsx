import { Stack, FormControl, FormControlLabel } from '@mui/material'
import React from 'react'
import { ValidatedCheckbox } from '~/components/app/forms/ValidatedCheckbox'
import { ValidatedTextField } from '~/components/app/forms/ValidatedTextField'
import { useUser } from '~/utils'

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

export default MetadataArea
