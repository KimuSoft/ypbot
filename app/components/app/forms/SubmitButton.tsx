import type { LoadingButtonProps } from '@mui/lab'
import { LoadingButton } from '@mui/lab'
import React from 'react'
import { useIsSubmitting } from 'remix-validated-form'

export const SubmitButton: React.FC<LoadingButtonProps> = (props) => {
  const submitting = useIsSubmitting()

  return (
    <LoadingButton
      type="submit"
      loadingPosition="start"
      {...props}
      loading={submitting || props.loading}
    />
  )
}
