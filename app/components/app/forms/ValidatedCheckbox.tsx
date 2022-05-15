import type { CheckboxProps } from '@mui/material'
import { Checkbox } from '@mui/material'
import { useTransition } from '@remix-run/react'
import React from 'react'
import { useField } from 'remix-validated-form'

export const ValidatedCheckbox: React.FC<CheckboxProps & { name: string }> = ({
  name,
  ...props
}) => {
  const field = useField(name)

  const submitting = useTransition().state === 'submitting'
  return (
    <Checkbox
      name={name}
      {...props}
      {...field.getInputProps()}
      defaultChecked={field.defaultValue}
      disabled={props.disabled || submitting}
    />
  )
}
