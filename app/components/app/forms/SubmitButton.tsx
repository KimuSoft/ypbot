import type { LoadingButtonProps } from '@mui/lab'
import { LoadingButton } from '@mui/lab'
import { useTransition } from '@remix-run/react'
import React from 'react'

export const SubmitButton: React.FC<LoadingButtonProps> = (props) => {
  const submitting = useTransition().state === 'submitting'

  return (
    <LoadingButton
      type="submit"
      loadingPosition={props.startIcon ? 'start' : 'center'}
      {...props}
      loading={submitting || props.loading}
    />
  )
}
