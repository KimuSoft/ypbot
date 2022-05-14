import type { TextFieldProps } from '@mui/material'
import { TextField } from '@mui/material'
import { useField } from 'remix-validated-form'

export const ValidatedTextField: React.FC<TextFieldProps & { name: string }> = (
  props
) => {
  const field = useField(props.name)

  return (
    <TextField
      {...field.getInputProps()}
      {...props}
      error={!!field.error}
      helperText={field.error ?? props.helperText}
    />
  )
}
