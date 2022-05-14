import type { TextFieldProps } from '@mui/material'
import { TextField } from '@mui/material'
import { useTransition } from '@remix-run/react'
import { useField } from 'remix-validated-form'

export const ValidatedTextField: React.FC<TextFieldProps & { name: string }> = (
  props
) => {
  const field = useField(props.name)
  const submitting = useTransition().state === 'submitting'

  return (
    <TextField
      {...field.getInputProps()}
      {...props}
      disabled={props.disabled || submitting}
      error={!!field.error}
      helperText={field.error ?? props.helperText}
    />
  )
}
